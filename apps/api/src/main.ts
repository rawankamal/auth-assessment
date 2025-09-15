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

  // Serve Angular frontend build (بعد الـ Docker build بيكون في ./public)
  const frontendPath = path.join(__dirname, 'public');

  app.use(express.static(frontendPath));

  // أي request مش API → رجّعه لـ index.html بتاع Angular
  const expressApp = app.getHttpAdapter().getInstance();
expressApp.get(
  /^(?!\/api).*/,
  (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
);

  const port = process.env['PORT'] || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
