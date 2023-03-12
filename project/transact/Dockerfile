FROM node:latest
WORKDIR /transact/
COPY package.json /transact/
RUN npm install
RUN npm install mongodb
COPY . .
CMD ["node", "transact.js"]

