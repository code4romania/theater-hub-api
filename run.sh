#!/bin/sh

envsubst _ormconfig.json > ormconfig.json

npm run serve
