import { Request, Response }    from "express";
import { File }                 from "../../dtos/files";
import { FileType, LocaleType } from "../../enums";

export interface IFileService {

    uploadFromStream (stream: any, fileType: FileType, userEmail: string, fileName: string): Promise<void>;

    uploadFile(file: File, fileType: FileType, userEmail: string): Promise<void>;

    uploadFiles(files: File[], fileType: FileType, userEmail: string): Promise<void[]>;

    deleteFile(fileKey: string): Promise<void>;

    deleteFiles(fileKeys: string[]): Promise<void[]>;

    setLocale(locale: LocaleType): void;

}
