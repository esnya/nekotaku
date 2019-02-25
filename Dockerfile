FROM node:10-alpine

RUN apk add --no-cache curl && \
    curl -L https://yarnpkg.com/install.sh | sh

ENV APP_PATH /usr/src/app/
WORKDIR $APP_PATH

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

ENV NODE_ENV production

COPY . $APP_PATH
COPY config/config.server.json config/config.json
COPY config/server.mongodb.json config/server.json
RUN sed -i -e 's/localhost:27017/db:27017/' -e 's/localhost/0.0.0.0/' config/server.json
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

CMD ["sh", "-c" ,"/wait && node index.js"]
