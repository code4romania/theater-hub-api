const config = require("../config/env").getConfig();

export class AWS {

    public static getThumbnailURL (key: string) {

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

        return `${config.aws.cloudFrontURL}/${Buffer.from(imageRequest).toString("base64")}`;
    }

}
