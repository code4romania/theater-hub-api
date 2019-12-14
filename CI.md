# CI Configuration

## GitHub Action Secrets

For the GitHub workflows to work, the following secrets must be defined:

** AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**: The AWS credentials to use when deploying the new version

**DOCKER_HUB_USERNAME**: The username to use when pushing images to the DockerHub.

**DOCKER_HUB_ACCESS_TOKEN**: An access token generated on DockerHub that the GitHub workflow uses to push images to the Docker Hub.