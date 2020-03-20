{
    "application": {
        "name": "Theater Hub",
        "email": "",
        "tokenSecret": "${th_api_token_secret}",
        "baseURL": "http://0.0.0.0:${th_api_port}",
        "maxFileSize": 5,
        "maxPhotoGalleryFileCount": 10
    },
    "client": {
        "baseURL": "${th_client_base_url}",
        "endpoints": {
            "loginResource": "login",
            "createProfileResource": "create-profile",
            "resetPasswordResource": "reset-password",
            "managedUserRegisterResource": "managed-user-signup"
        }
    },
    "facebook": {
        "app_id": "${th_api_facebook_app_id}",
        "app_secret": "${th_api_facebook_app_secret}",
        "callback_resource": "api/authentication/facebook/callback"
    },
    "google": {
        "app_id": "${th_api_google_app_id}",
        "app_secret": "${th_api_google_app_secret}",
        "callback_resource": "api/authentication/google/callback"
    },
    "youtube": {
       "api_key": "${th_api_youtube_api_key}",
       "videos_information_url": "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={0}&key={1}"
    },
    "vimeo": {
       "videos_information_url": "https://vimeo.com/api/v2/video/{0}.json"
    },
    "aws": {
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "${th_aws_region}",
        "files_bucket": "${th_aws_s3_bucket}",
        "cloudFront": {
            "url": "",
            "accessKeyId": "",
            "privateKeyFileName": "cloudfront.pem"
        },
        "files_ACL": "private",
        "signed_url_expiry": 86400,
        "cache_control_max_age": 86400,
        "ses": {
            "host": "",
            "port": 465,
            "secure": true,
            "user": "",
            "pass": ""
        }
    },
    "mailchimp": {
        "api_key": "",
        "audience_id": "",
        "subscribe_url": "/lists/{0}/members"
    }
}
