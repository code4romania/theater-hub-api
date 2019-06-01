export const commonConfig = {
    application: {
        name: "Theater Hub",
        email: "",
        tokenSecret: "",
        baseURL: "https://127.0.0.1:443",
        maxFileSize: 5, // MB
        maxPhotoGalleryFileCount: 10
    },
    client: {
        baseURL: "http://localhost:3000",
        endpoints: {
            loginResource: "login",
            createProfileResource: "create-profile",
            resetPasswordResource: "reset-password",
            managedUserRegisterResource: "managed-user-signup"
        }
    },
    facebook: {
        app_id: "",
        app_secret: "",
        callback_url: "https://127.0.0.1:443/api/authentication/facebook/callback"
    },
    google: {
        app_id: "",
        app_secret: "",
        callback_url: "https://127.0.0.1:443/api/authentication/google/callback"
    },
    youtube: {
       api_key: "",
       videos_information_url: "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={0}&key={1}"
    },
    mailer: {
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: ""
    },
    aws: {
        accessKeyId: "",
        secretAccessKey: "",
        region: "",
        files_bucket: ""
    }
};
