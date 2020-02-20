#!/bin/sh

# TODO: REMOVE as this prints the secrets
env

envsubst _ormconfig.json > ormconfig.json

# TODO: REMOVE as this prints the secrets
cat ormconfig.json

npm run serve
