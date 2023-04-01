import { Controller, Get, StreamableFile, Response, NotFoundException } from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import { createReadStream } from "fs";
import { join } from "path";
import configuration from "src/core/config/configuration";
import { Endpoint } from "src/core/enums";
import { CommonErrors } from "src/core/responses";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Events } from "src/modules/webhook/enums/events.enum";

@Controller(Endpoint.COMMON)
export class CommonController {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    @Get("errors")
    getErrorFile(@Response({ passthrough: true }) res: ExpressResponse): StreamableFile {
        try {
            const file = createReadStream(join(process.cwd(), `${configuration().logs.fileName}.json`));
            res.set({
                "Content-Type": "application/json",
                // eslint-disable-next-line prettier/prettier
                "Content-Disposition": `attachment; filename="${configuration().logs.fileName}.json"`,
            });
            return new StreamableFile(file);
        } catch (e) {
            throw new NotFoundException(CommonErrors.E_404_FILE_NOT_EXIST);
        }
    }

    @Get("test-webhook")
    testWebhook(): void {
        const user = {
            name: "Waruna Udayanga",
            studentIdString: "SOF/21/B2/54",
            createdAt: new Date(),
            course: {
                code: "SOF",
                name: "Software Technology",
            },
        };
        this.eventEmitter.emit(Events.USER_REGISTERED, user);
    }
}
