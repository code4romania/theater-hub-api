import { inject, injectable }   from "inversify";
import * as uuid                from "uuid/v4";
import { TYPES }                from "../types";
import { IFileService }         from "./IFileService";
import { ILocalizationService } from "./ILocalizationService";
import { File }                 from "../dtos";
import { FileType, LocaleType } from "../enums";
import { FileManager }          from "../utils";

const AWS       = require("aws-sdk");
const config    = require("../config/env").getConfig();

@injectable()
export class FileService implements IFileService {

    private readonly _s3: any;
    private _hasBucket: boolean;

    protected readonly _localizationService: ILocalizationService;

    constructor (@inject(TYPES.LocalizationService) localizationService: ILocalizationService) {

        this._localizationService = localizationService;

        AWS.config.update({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            region: config.aws.region
        });

        this._s3 = new AWS.S3();
    }

    private checkIfBucketExists (bucketName: string): Promise<void> {
        const objectParams = {
            Bucket: bucketName
        };

        return this._s3.headBucket(objectParams).then((data: any) => {
            this._hasBucket = true;
        },
        (error: any) => {
            this._hasBucket = false;
        });
    }

    public async uploadFile (file: any, fileType: FileType, userEmail: string): Promise<void> {
        if (!file) {
            return;
        }

        const key: string           = uuid();
        const fileExtension: string = FileManager.getFileExtension(fileType);

        const objectParams = {
            Bucket: config.aws.files_bucket,
            Key: `${userEmail}/${key}.${fileExtension}`,
            Body: file.buffer,
            ACL: "public-read",
        };

        return this._s3.upload(objectParams).promise();

    }

    public async uploadFiles (files: File[], fileType: FileType, userEmail: string): Promise<void[]> {
        return Promise.all(files.map(f => {
            return this.uploadFile(f, fileType, userEmail);
        }));
    }

    public async deleteFile (fileKey: string): Promise<void> {
        if (!fileKey) {
            return;
        }

        const objectParams = {
            Bucket: config.aws.files_bucket,
            Key: fileKey
        };

        await this._s3.deleteObject(objectParams).promise();

    }

    public async deleteFiles (fileKeys: string[]): Promise<void[]> {
        return Promise.all(fileKeys.map(k => {
            return this.deleteFile(k);
        }));
    }

    public setLocale (locale: LocaleType): void {
        this._localizationService.setLocale(locale);
    }

}
