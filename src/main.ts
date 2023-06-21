import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
  }));

  if (!(process.env.NODE_ENV === 'production')) {
    setupSwagger(app);
  }
  await app.listen(3000);
}
bootstrap();
