# Build Stage
FROM node:10-alpine as build_stage
RUN apk add python3 make g++ bash

WORKDIR /app/
COPY package.json ./
COPY package-lock.json ./
COPY ormconfig.js ./
RUN npm install
COPY . .
RUN bash -c 'for conf in $(ls src/config/env/_*.ts); do mv $conf ${conf//_/}; done'
RUN npm run build

# Final Image Stage
FROM node:10-alpine as prod_stage

RUN apk add --no-cache openssl

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app/
COPY package.json .
COPY .env.example .
COPY ormconfig.js .
COPY ./docker/docker-entrypoint /

COPY --from=build_stage /app/node_modules ./node_modules
COPY --from=build_stage /app/dist ./dist

ENTRYPOINT ["/docker-entrypoint"]
