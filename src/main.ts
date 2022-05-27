import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

const start = async () => {
  try {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true,
        validationError: {
          target: true,
          value: true,
        },
      }),
    );
    await app.listen(PORT, () => console.log(`running on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
