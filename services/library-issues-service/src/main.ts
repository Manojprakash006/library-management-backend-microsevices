import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'library.issues',
      protoPath: join(process.cwd(), 'proto/issues.proto'),
      url: process.env.GRPC_URL || '0.0.0.0:5003',
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
    .setTitle('Library Issues Service')
    .setDescription('API for managing book issues, returns, and renewals')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003);
  console.log(`Library Issues Service is running on: ${await app.getUrl()}`);
  console.log(`gRPC server is running on: ${process.env.GRPC_URL || '0.0.0.0:5003'}`);
}

bootstrap();
