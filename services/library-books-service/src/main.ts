import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Determine proto file path (local dev vs Docker)
  const localProtoPath = join(__dirname, '../../proto/books.proto');
  const dockerProtoPath = join(__dirname, '../proto/books.proto');
  const protoPath = fs.existsSync(localProtoPath) ? localProtoPath : dockerProtoPath;

  // gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'library.books',
      protoPath: process.env.PROTO_PATH || join(process.cwd(), 'proto/books.proto'),
      url: process.env.GRPC_URL || '0.0.0.0:5001',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Library Books Service')
    .setDescription('API for managing library books, products, and reviews')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3001);

  console.log(`Library Books Service is running on: ${await app.getUrl()}`);
  console.log(`gRPC server is running on: ${process.env.GRPC_URL || '0.0.0.0:5001'}`);
}

bootstrap();
