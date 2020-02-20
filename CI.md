# CI Configuration

## GitHub Action Secrets

For the GitHub actions workflow to work, the following secrets must be defined:

* **AWS_ACCESS_KEY_ID**: The Access Key ID of the AWS credentials to use for deploying Theater Hub API.
* **AWS_SECRET_ACCESS_KEY**: The Secret Access Key part of the AWS credentials.
* **DOCKER_HUB_USERNAME**: The username to use when pushing images to the DockerHub.
* **DOCKER_HUB_ACCESS_TOKEN**: An access token generated on DockerHub that the GitHub workflow uses to push images to the Docker Hub.


## ECS Secrets

The following secrets must be passed to the container as env vars:

* **TH_POSTGRES_HOST**: The host of the postgres server.
* **TH_POSTGRES_USERNAME**: The username to use for connecting to Postgres.
* **TH_POSTGRES_PASSWORD**: The password to use for connecting to Postgres.

## Terraforming

```
$ terraform init
...
$ terraform apply -var=aws_profile=miez -var=aws_region=eu-central-1 -var=th_api_docker_image=eugenanghel/theater-hub-api:Eugen-TH-76-latest
...
```