import { FileType } from "../enums";

export class FileManager {

    public static getFileExtension (fileType: FileType) {

        switch (fileType) {
            case FileType.Image:
            default:
                return "jpg";
        }
    }

}
