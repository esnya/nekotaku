FROM node:10-alpine

RUN apk add --no-cache curl && \
    curl -L https://yarnpkg.com/install.sh | sh

ENV APP_PATH /usr/src/app/
WORKDIR $APP_PATH

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . $APP_PATH
COPY config/config.server.json config/config.json
COPY config/server.mongodb.json config/server.json
RUN sed -i -e 's/localhost:27017/db:27017/' -e 's/localhost/0.0.0.0/' config/server.json
RUN yarn build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait
