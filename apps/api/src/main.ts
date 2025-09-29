import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https:'],
          styleSrc: ["'self'", 'https:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https://api.timeworth.site'],
          fontSrc: ["'self'", 'https:'],
        },
      },
      frameguard: { action: 'sameorigin' },
      referrerPolicy: { policy: 'no-referrer' },
      noSniff: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
