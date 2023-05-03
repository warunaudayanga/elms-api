import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService, GetMany, IPaginatedResponse } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { ClassRoom } from "../entities/class-room.entity";
import { ClassRoomRepository } from "../repositories";
import { EntityManager, FindOneOptions } from "typeorm";
import { EH } from "../../../../core/entity/entity.types";
import { ChatRoomService } from "./chat-room.service";
import { GradeService } from "./grade.service";
import { ClassSubjectService } from "./class-subject.service";
import { AppEvent } from "../../../../core/enums/app-event.enum";

@Injectable()
export class ClassRoomService extends EntityService<ClassRoom> {
    constructor(
        @InjectRepository(ClassRoomRepository) private readonly classRoomRepository: ClassRoomRepository,
        protected readonly chatRoomService: ChatRoomService,
        protected readonly gradeService: GradeService,
        protected readonly subjectService: ClassSubjectService,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, classRoomRepository, "classRoom");
    }

    createCLassRoom(createClassRoomDto: Partial<ClassRoom>, options?: FindOneOptions<ClassRoom>): Promise<ClassRoom> {
        return this.classRoomRepository.transaction(async (manager) => {
            const classRoom = await this.classRoomRepository.saveAndGet(createClassRoomDto, options, manager);
            await this.chatRoomService.save(
                { name: classRoom.name, classRoom, users: [{ id: classRoom.tutorId }] },
                null,
                manager,
            );
            return classRoom;
        });
    }

    updateClassRoom(
        userId: number,
        id: number,
        updateClassRoomDto: Partial<ClassRoom>,
        options?: FindOneOptions<ClassRoom>,
    ): Promise<ClassRoom> {
        return this.classRoomRepository.transaction(async (manager) => {
            if (updateClassRoomDto.name) {
                const classRoom = await this.classRoomRepository.get(id, options, manager);
                const name = `${classRoom.grade.name} ${classRoom.subject.name} - ${updateClassRoomDto.name}`;
                await this.chatRoomService.update(classRoom.chatRoom.id, { name }, undefined, manager);
            }
            let newClass = await this.classRoomRepository.updateAndGet(id, { ...updateClassRoomDto }, options, manager);
            this.socketService.sendMessage(AppEvent.CLASS_UPDATED, newClass, userId);
            return newClass;
        });
    }

    async getMany(
        getMany: GetMany<ClassRoom>,
        manager?: EntityManager,
        eh?: EH,
    ): Promise<IPaginatedResponse<ClassRoom> | ClassRoom[]> {
        let res = await super.getMany(getMany, manager, eh);
        const classes = res instanceof Array ? res : res.data;
        const grades = await this.gradeService.getByIds(
            { ids: classes.map((c) => c.changeRequest?.gradeId) },
            manager,
            eh,
        );
        const subjects = await this.subjectService.getByIds(
            { ids: classes.map((c) => c.changeRequest?.subjectId) },
            manager,
            eh,
        );
        classes.forEach((c) => {
            if (c.changeRequest) {
                c.changeRequest.grade = grades.find((g) => g.id === c.changeRequest.gradeId);
                c.changeRequest.subject = subjects.find((s) => s.id === c.changeRequest.subjectId);
            }
        });
        return res instanceof Array ? classes : { ...res, data: classes };
    }
}
