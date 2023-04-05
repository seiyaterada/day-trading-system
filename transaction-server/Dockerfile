FROM node:16

ENV NEW_RELIC_NO_CONFIG_FILE=true \
NEW_RELIC_LOG=stdout

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD npx ts-node src/index.ts