// noinspection JSUnusedGlobalSymbols

import { Injectable } from "@nestjs/common";
import { MulterFile } from "../../core/interfaces/multer-file";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { FileCategory } from "./enums/file-category.enum";

@Injectable()
export class FileUploadService {
    async upload(file: MulterFile, category: FileCategory = FileCategory.FILE): Promise<string> {
        const dir = `./uploads/${category}`;
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }
        const timestamp = new Date().getTime();
        const ext = file.originalname.split(".").pop() ?? "";
        const filename = `${dir}/${timestamp}.${ext}`;
        await writeFileSync(filename, file.buffer);
        return filename;
    }
}
