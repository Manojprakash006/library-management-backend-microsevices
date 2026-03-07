FROM node:18-alpine

WORKDIR /

COPY package*.json ./

COPY package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm","run","start" ]