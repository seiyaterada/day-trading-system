FROM node:16-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD npx ts-node src/index.ts