import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  // Create a NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins and allow credentials
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Set a global prefix for all API routes
  app.setGlobalPrefix('api');

  // Define the path to the frontend static files
  const frontendPath = path.join(__dirname, '..', '/frontend');

  // Serve static files from the frontend directory
  app.use(express.static(frontendPath));

  // For any non-API request, serve the Angular index.html file
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get(
    /^(?!\/api).*/,
    (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  );

  // Start the server on the specified port or default to 8080
  const port = process.env['PORT'] || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
