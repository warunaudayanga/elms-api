import { Injectable, NestMiddleware } from "@nestjs/common";
import { json } from "body-parser";
import { IncomingMessage, ServerResponse } from "http";
import { NextFunction } from "express";

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
    use(req: IncomingMessage, res: ServerResponse, next: NextFunction): void {
        json()(req, res, next);
    }
}
