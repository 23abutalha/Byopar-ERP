import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable Global Validation (for your DTOs)
  app.useGlobalPipes(new ValidationPipe());

  // Allow Frontend to talk to Backend
  app.enableCors();

  await app.listen(3001);
  console.log(`🚀 Byopar Backend is running on: http://localhost:3000`);
}
bootstrap();