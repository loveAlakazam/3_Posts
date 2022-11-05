import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sessionConfig } from './auth/auth.session.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  sessionConfig(app);

  const port = process.env.SERVER_PORT || 3000;
  await app.listen(port);
}
bootstrap();
