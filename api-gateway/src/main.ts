import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/library/books',
    createProxyMiddleware({
      target: 'http://library-books-service:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/library/books': '',
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
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
