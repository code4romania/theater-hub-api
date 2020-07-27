[
  {
    "name": "theater-hub-api",
    "image": "${TH_API_DOCKER_IMAGE}",
    "cpu": ${TH_API_ECS_CPU},
    "memory": ${TH_API_ECS_MEMORY},
    "essential": true,
    "networkMode": "awsvpc",

    "portMappings": [
      {
        "containerPort": ${TH_API_PORT},
        "hostPort": ${TH_API_PORT},
        "protocol": "tcp"
      }
    ],
    "environment": [
      { "name": "TH_POSTGRES_HOSTNAME", "value": "${TH_POSTGRES_HOSTNAME}" },
      { "name": "TH_POSTGRES_USERNAME", "value": "${TH_POSTGRES_USERNAME}" }
    ],

    "secrets": [
      {
        "name": "CONFIG",
        "valueFrom": "${TH_CONFIG_SSM_ARN}"
      },
      {
        "name": "TH_POSTGRES_PASSWORD",
        "valueFrom": "${TH_POSTGRES_PASSWORD_SSM_ARN}"
      }
    ]
  }
]
