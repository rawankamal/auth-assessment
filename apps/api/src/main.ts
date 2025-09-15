import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Serve Angular frontend build - CORRECTED PATH
  const frontendPath = path.join(__dirname, '..', 'apps', 'frontend');
  console.log('Frontend path:', frontendPath);

  app.use(express.static(frontendPath));

  // Handle Angular routes (SPA fallback)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get(
    /^(?!\/api).*/,
    (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  );

  // CRITICAL FIX: Use Cloud Run PORT environment variable and bind to 0.0.0.0
  const port = parseInt(process.env['PORT'] || '8080', 10);
  const host =
    process.env['NODE_ENV'] === 'production' ? '0.0.0.0' : 'localhost';

  await app.listen(port, host);

  console.log(`🚀 Server running on ${host}:${port}`);
  console.log(`📱 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  console.log(`🔗 Frontend served from: ${frontendPath}`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
