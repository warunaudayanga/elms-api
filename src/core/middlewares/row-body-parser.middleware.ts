import { Injectable, NestMiddleware, RawBodyRequest } from "@nestjs/common";
import { json } from "body-parser";
import { IncomingMessage, ServerResponse } from "http";
import { NextFunction, Request } from "express";

/**
 * Copied this middleware to parse the raw response into a param to use later
 * from https://github.com/golevelup/nestjs/blob/master/packages/webhooks/src/webhooks.middleware.ts
 */
@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
    public use(req: IncomingMessage, res: ServerResponse, next: NextFunction): void {
        json({
            verify: (req: RawBodyRequest<Request>, res: ServerResponse, buffer: Buffer) => {
                if (Buffer.isBuffer(buffer)) {
                    req.rawBody = Buffer.from(buffer);
                }
                return true;
            },
        })(req, res, next);
    }
}
