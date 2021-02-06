export const commonConfig = {
    application: {
        name: "Theater Hub",
        email: "",
        tokenSecret: "",
        baseURL: `http://127.0.0.1:${process.env.TH_API_PORT}`,
        maxFileSize: 5, // MB
        maxPhotoGalleryFileCount: 10
    },
    client: {
        baseURL: process.env.TH_CLIENT_BASE_URL,
        endpoints: {
            loginResource: "login",
            createProfileResource: "create-profile",
            resetPasswordResource: "reset-password",
            managedUserRegisterResource: "managed-user-signup"
        }
    },
    facebook: {
        app_id: "lorem ipsum",
        app_secret: "lorem ipsum",
        callback_resource: "api/authentication/facebook/callback"
    },
    google: {
        app_id: "lorem ipsum",
        app_secret: "lorem ipsum",
        callback_resource: "api/authentication/google/callback"
    },
    youtube: {
       api_key: "lorem ipsum",
       videos_information_url: "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={0}&key={1}"
    },
    vimeo: {
       videos_information_url: "https://vimeo.com/api/v2/video/{0}.json"
    },
    aws: {
        accessKeyId: "",
        secretAccessKey: "",
        region: "",
        files_bucket: "",
        files_prefix: {
            profile: "profile",
            projects: "projects"
        },
        cloudFront: {
            url: "",
            accessKeyId: "",
            privateKeyFileName: "cloudfront.pem"
        },
        files_ACL: "private",
        signed_url_expiry: 86400,
        cache_control_max_age: 86400,
        ses: {
            host: "",
            port: 465,
            secure: true,
            user: "",
            pass: ""
        }
    },
    mailchimp: {
        api_key: process.env.TH_MAILGUN_API_KEY,
        audience_id: process.env.TH_MAILGUN_AUDIENCE_ID,
        subscribe_url: "/lists/{0}/members"
    }
};
