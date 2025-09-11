import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, //srive para evitar que mande mas info a la api
    })
  )

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Application running on port ${PORT}`);
}
bootstrap();
