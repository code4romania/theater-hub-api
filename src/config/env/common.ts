export const commonConfig = {
    application: {
        name: "Theater Hub",
        email: "theaterhub.ro@gmail.com",
        tokenSecret: "7E7BE0F3-0B7C-4B92-8F35-D565875AEB3A"
    },
    client: {
        baseURL: "http://localhost:3000",
        endpoints: {
            createProfileResource: "create-profile",
            resetPasswordResource: "reset-password"
        }
    },
    facebook: {
        app_id: "268723110498871",
        app_secret: "e32beac726d3334e2a943d27b36954ff",
        callback_url: "https://localhost:4000/api/authentication/facebook/callback"
    },
    google: {
        app_id: "",
        app_secret: "",
        callback_url: ""
    },
    mailer: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        user: "theaterhub.ro@gmail.com",
        pass: "E98CB261-8EEF-43C7-B044-700486BCDE04"
    }
};
