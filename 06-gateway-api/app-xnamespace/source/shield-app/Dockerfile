FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY server.js .
COPY badge.png .

EXPOSE 8080

CMD ["npm", "start"]
