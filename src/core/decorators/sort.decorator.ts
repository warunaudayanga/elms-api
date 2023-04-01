import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ISort } from "../entity";

export const Sorter = createParamDecorator((data: any, ctx: ExecutionContext): ISort<unknown> => {
    const req = ctx.switchToHttp().getRequest();
    const order: ISort<unknown> = {};
    if (req.query?.sort && req.query?.sort !== "undefined") {
        const sortColumns = req.query.sort.split(",");
        sortColumns.forEach((column) => {
            const property: string[] = column.split(".");
            const sortColumn: string = property[0];
            const sortOrder: string = property[1].toUpperCase();
            order[sortColumn] = sortOrder === "ASC" ? "ASC" : "DESC";
        });
    }
    return order;
});
