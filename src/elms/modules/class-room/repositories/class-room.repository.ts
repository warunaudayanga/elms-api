import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository, relations } from "../../../../core/entity";
import { ClassRoom } from "../entities/class-room.entity";
import { IClassRoomRepository } from "../interfaces/repositories";

export const classRoomRelations = ["grade", "subject", "tutor", "schedule", "classStudents"];
export const classRoomRelationsAll = [
    "grade",
    "subject",
    "tutor",
    "schedule",
    "classStudents",
    "classStudents.classPayments",
    "classStudents.classPayments.payment",
    "chatRoom",
    "chatRoom.users",
    "assessments",
    "assessments.submissions",
    ...relations,
];

@CustomRepository(ClassRoom)
export class ClassRoomRepository extends BaseRepository<ClassRoom> implements IClassRoomRepository {}
