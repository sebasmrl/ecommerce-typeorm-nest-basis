import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
    })
  )
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT);
  logger.log(`Backend running on PORT:${process.env.PORT}`)
}
bootstrap();
