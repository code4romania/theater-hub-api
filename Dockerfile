# Build Stage
FROM node:12-alpine as build_stage
RUN apk add python3 make g++ bash
WORKDIR /app/
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN bash -c 'for conf in $(ls src/config/env/_*.ts); do mv $conf ${conf//_/}; done'
RUN npm run build

# Final Image Stage
FROM node:12-alpine as prod_stage
WORKDIR /app/
COPY . .
RUN sh -c 'for conf in $(ls src/config/env/_*.ts); do mv $conf ${conf//_/}; done'
COPY --from=build_stage /app/node_modules ./node_modules
COPY --from=build_stage /app/dist ./dist
EXPOSE 4002
CMD run.sh
