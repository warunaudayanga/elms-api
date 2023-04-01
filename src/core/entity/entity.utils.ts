import { IQueryError, IStatusResponse } from "./interfaces";
import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { LoggerService } from "../services";
import { EntityErrors } from "./entity.error.responses";
import { ErrorType, Operation } from "./entity.enums";
import { EntityResponses } from "./entity.responses";

export class EntityUtils {
    public static handleError(e: IQueryError, entityName: string, uniqueFieldName?: string): void {
        switch (e.code) {
            case ErrorType.ER_NO_DEFAULT_FOR_FIELD:
                const field = e.sqlMessage.split("'")[1];
                throw new BadRequestException(EntityErrors.E_400_NO_DEFAULT(entityName, field));
            case ErrorType.ER_DUP_ENTRY:
                throw new ConflictException(EntityErrors.E_409_EXIST_U(entityName, uniqueFieldName));
            default:
                LoggerService.error(e);
                throw new InternalServerErrorException(EntityErrors.E_500);
        }
    }

    public static handleSuccess(operation?: Operation, entityName?: string): IStatusResponse {
        switch (operation) {
            case Operation.CREATE:
                return EntityResponses.CREATED(entityName);
            case Operation.UPDATE:
                return EntityResponses.UPDATE(entityName);
            case Operation.SAVE:
                return EntityResponses.SAVE(entityName);
            default:
                return EntityResponses.SUCCESS;
        }
    }
}
