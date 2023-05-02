import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository, relations } from "../../../../core/entity";
import { ClassStudent } from "../entities";
import { IClassStudentsRepository } from "../interfaces/repositories";

// noinspection JSUnusedGlobalSymbols
export const classStudentRelations = ["classRoom", "student", "payments", ...relations];

@CustomRepository(ClassStudent)
export class ClassStudentsRepository extends BaseRepository<ClassStudent> implements IClassStudentsRepository {}
