import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { ClassSubject } from "../entities/subject.entity";
import { IClassSubjectRepository } from "../interfaces/repositories";

@CustomRepository(ClassSubject)
export class ClassSubjectRepository extends BaseRepository<ClassSubject> implements IClassSubjectRepository {}
