import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('GATEWAY');

  // Simple Request Logger Middleware
  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175','http://localhost:5176', 'http://localhost:7070'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Pragma, Cache-Control',
  });

  app.use(
    '/library/books',
    createProxyMiddleware({
      target: 'http://library-books-service:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/library/books': '',
      },
      onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
      },
    }),
  );

  app.use(
    '/library/members',
    createProxyMiddleware({
      target: 'http://library-members-service:3012',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/library/members': '',
      },
      onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
      },
    }),
  );

  app.use(
    '/library/issues',
    createProxyMiddleware({
      target: 'http://library-issues-service:3013',
      changeOrigin: true,
      pathRewrite: {
        '^/library/issues': '',
      },
      onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
      },
    }),
  );

  app.use(
    '/library/requests',
    createProxyMiddleware({
      target: 'http://library-requests-service:3014',
      changeOrigin: true,
      pathRewrite: {
        '^/library/requests': '',
      },
      onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
      },
    }),
  );

  app.use(
    '/library/payments',
    createProxyMiddleware({
      target: 'http://library-payments-service:3005',
      changeOrigin: true,
      pathRewrite: {
        '^/library/payments': '',
      },
      onProxyReq: (proxyReq, req) => {
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
