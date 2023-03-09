FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

# COPY
COPY . .

RUN npm install

# Run and expose the server on port 4000
EXPOSE 4000

# A command to start the server
CMD ["node", "bin/index.js"]