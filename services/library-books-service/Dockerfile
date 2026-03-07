FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Copy proto files for gRPC
COPY proto/ dist/proto/

EXPOSE 3001

CMD ["node", "dist/main"]
