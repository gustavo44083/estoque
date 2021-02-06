import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT: number = parseInt(process.env.PORT || '3000');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.setGlobalPrefix('/api/v1');
  await app.listen(PORT);
}

bootstrap();
