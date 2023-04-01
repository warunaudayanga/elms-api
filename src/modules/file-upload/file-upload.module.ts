import { Global, Module } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [FileUploadService],
    exports: [FileUploadService],
})
export class FileUploadModule {}
