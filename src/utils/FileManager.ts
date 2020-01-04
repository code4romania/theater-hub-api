import { FileType } from "../enums";

export class FileManager {

    public static getFileExtension (fileType: FileType) {

        switch (fileType) {
            case FileType.PDF:
                return "pdf";
            case FileType.UserImage:
            case FileType.ProjectImage:
            default:
                return "jpg";
        }
    }

}
