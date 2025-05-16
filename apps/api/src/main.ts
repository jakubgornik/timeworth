import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    // set to env
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
