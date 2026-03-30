import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:  ["http://localhost:5173", "http://localhost:5174"],
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
