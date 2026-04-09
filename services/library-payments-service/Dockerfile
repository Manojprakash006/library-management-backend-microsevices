FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

RUN npm prune --production

# Copy proto files for gRPC
# COPY proto/ dist/proto/

EXPOSE 3005

CMD ["node", "dist/main"]
