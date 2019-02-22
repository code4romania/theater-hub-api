export const commonConfig = {
    application: {
        name: "Theater Hub",
        email: "",
        tokenSecret: ""
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
    mailer: {
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: ""
    }
};
