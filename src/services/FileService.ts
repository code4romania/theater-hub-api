import { inject, injectable }   from "inversify";
import * as uuid                from "uuid/v4";
import * as path                from "path";
import { TYPES }                from "../types";
import { IFileService,
        ILocalizationService }  from "../contracts";
import { File }                 from "../dtos";
import { FileType, LocaleType } from "../enums";
import { FileManager }          from "../utils";

const AWS       = require("aws-sdk");
const fs        = require("fs");
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

    public getPresignedURL (fileKey: string): string {

        return this._s3.getSignedUrl("getObject", {
            Bucket: config.aws.files_bucket,
            Key: fileKey,
            Expires: config.aws.signed_url_expiry
        });
    }

    public getThumbnailURL (key: string): string {

        const imageRequest = JSON.stringify({
            bucket: config.aws.files_bucket,
            key,
            edits: {
                resize: {
                    height: 200,
                    fit: "contain"
                }
            }
        });

        return `${config.aws.cloudFront.url}/${Buffer.from(imageRequest).toString("base64")}`;
    }

    public getSignedCloudFrontUrl (url: string, privateKey?: string): string {

        if (!privateKey) {
            privateKey = fs.readFileSync(path.join(process.cwd(), "certificate", config.aws.cloudFront.privateKeyFileName), "utf8");
        }

        const cloudFront = new AWS.CloudFront.Signer (
            config.aws.cloudFront.accessKeyId,
            privateKey
        );

        return cloudFront.getSignedUrl({
            url,
            expires: Math.floor((new Date()).getTime() / 1000) + config.aws.signed_url_expiry
        });

    }

    public async uploadFromStream (stream: any, fileType: FileType, userEmail: string, fileName: string): Promise<void> {

        const fileExtension: string = FileManager.getFileExtension(fileType);

        const objectParams = {
            Bucket: config.aws.files_bucket,
            Key: `${userEmail}/${fileName}.${fileExtension}`,
            Body: stream,
            ACL: config.aws.files_ACL
        };

        return this._s3.upload(objectParams).promise();
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
            ACL: config.aws.files_ACL,
            Metadata: {
                "Cache-Control": `max-age=${config.aws.cache_control_max_age}`
            }
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
