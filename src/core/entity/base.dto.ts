import { IsEmpty } from "class-validator";
import { IBaseEntity } from "./interfaces";
import { Status } from "../enums";
import { User } from "src/modules/auth/entities/user.entity";
import { Errors } from "../responses";
import { toErrString } from "../converters";

// noinspection JSUnusedGlobalSymbols
export class BaseDto implements IBaseEntity {
    @IsEmpty()
    id: number;

    @IsEmpty(toErrString(Errors.E_400_NOT_EMPTY_STATUS))
    status: Status;

    @IsEmpty()
    createdAt: Date;

    @IsEmpty()
    createdBy?: User;

    @IsEmpty()
    updatedAt: Date;

    @IsEmpty()
    updatedBy?: User;

    @IsEmpty()
    deletedAt?: Date;

    @IsEmpty()
    deletedBy?: User;
}
