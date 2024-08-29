FROM node:18.12.0-alpine3.15 AS builder
ADD . /app
RUN apk add bash
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo make
RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        azure-cli \
    && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk
RUN apk add chromium \
    harfbuzz
WORKDIR /app
COPY package*.json /app/
RUN npm install -g typescript
COPY src ./src
COPY tsconfig.json ./
RUN npm cache clean --force
# RUN rm -rf node_modules
# RUN npm rm @types/glob @types/rimraf minimatch @types/minimatch
RUN npm install
RUN rm -rf ./node_modules/@types/glob
RUN npm run build

##RUN npm run build

FROM node:18.12.0-alpine3.15
RUN apk add bash
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo make
RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install \
        azure-cli \
    && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk
RUN apk add chromium \
    harfbuzz \
    dos2unix
RUN apk update
RUN apk upgrade
COPY . /app
WORKDIR /app

COPY package*.json /app/
RUN npm install pm2 -g
RUN npm install sharp
COPY --from=builder ./app/dist/ .

COPY entrypoint.sh /app/entrypoint.sh
RUN dos2unix /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]
