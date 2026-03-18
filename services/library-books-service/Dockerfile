FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/
RUN npm config set fetch-retry-maxtimeout 600000
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

COPY proto/ dist/proto/

EXPOSE 3001

CMD ["node", "dist/main.js"]