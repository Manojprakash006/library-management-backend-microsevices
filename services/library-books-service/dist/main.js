"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const fs = require("fs");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const localProtoPath = (0, path_1.join)(__dirname, '../../proto/books.proto');
    const dockerProtoPath = (0, path_1.join)(__dirname, '../proto/books.proto');
    const protoPath = fs.existsSync(localProtoPath) ? localProtoPath : dockerProtoPath;
    app.connectMicroservice({
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'library.books',
            protoPath: process.env.PROTO_PATH || (0, path_1.join)(process.cwd(), 'proto/books.proto'),
            url: process.env.GRPC_URL || '0.0.0.0:5001',
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Library Books Service')
        .setDescription('API for managing library books, products, and reviews')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3001);
    console.log(`Library Books Service is running on: ${await app.getUrl()}`);
    console.log(`gRPC server is running on: ${process.env.GRPC_URL || '0.0.0.0:5001'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map