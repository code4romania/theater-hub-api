export const commonConfig = {
    application: {
        name: "Theater Hub",
        email: "",
        tokenSecret: ""
    },
    client: {
        baseURL: "http://localhost:3000",
        endpoints: {
            createProfileResource: "create-profile",
            resetPasswordResource: "reset-password",
            setPasswordResource: "set-password"
        }
    },
    facebook: {
        app_id: "",
        app_secret: "",
        callback_url: ""
    },
    google: {
        app_id: "",
        app_secret: "",
        callback_url: ""
    },
    mailer: {
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: ""
    }
};
