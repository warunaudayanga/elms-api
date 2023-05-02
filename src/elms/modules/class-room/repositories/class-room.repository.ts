import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository, relations } from "../../../../core/entity";
import { IClassRoomRepository } from "../interfaces/repositories";
import { ClassRoom } from "../entities";

export const classRoomRelations = ["grade", "subject", "tutor", "schedule", "classStudents", "classStudents.payments"];
export const classRoomRelationsAll = [
    "grade",
    "subject",
    "tutor",
    "schedule",
    "classStudents",
    "classStudents.payments",
    "chatRoom",
    "chatRoom.users",
    "assessments",
    "assessments.submissions",
    ...relations,
];

@CustomRepository(ClassRoom)
export class ClassRoomRepository extends BaseRepository<ClassRoom> implements IClassRoomRepository {}
