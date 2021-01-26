#! /usr/bin/env sh
set -x

DEPLOY_DIR=$(dirname "$0")
SOURCE_DIR="${DEPLOY_DIR}/../"

cd $SOURCE_DIR \
    && git pull \
    && docker-compose --env-file .env down \
    && docker-compose --env-file .env build \
    && docker-compose --env-file .env up -d
