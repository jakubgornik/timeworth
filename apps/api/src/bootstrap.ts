import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { requestContextMiddleware } from './shared/diagnostics/request-context';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  try {
    const config = app.get(ConfigService);
    app.use(requestContextMiddleware);

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
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            connectSrc: [
              "'self'",
              'https://tvkopeytneyrbkpazvuq.storage.supabase.co',
              'https://o4510104628559872.ingest.de.sentry.io',
            ],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: [],
            blockAllMixedContent: [],
          },
        },
        frameguard: {
          action: 'deny',
        },
        referrerPolicy: {
          policy: 'strict-origin-when-cross-origin',
        },
        noSniff: true,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: { policy: 'same-origin' },
        crossOriginResourcePolicy: { policy: 'same-origin' },
      }),
    );

    app.enableCors({
      origin: config.getOrThrow<string>('CORS_ORIGIN').split(','),
      exposedHeaders: ['X-Request-Id'],
      credentials: true,
    });

    await app.listen(config.getOrThrow<number>('PORT'));
  } catch (error) {
    await app.close();
    throw error;
  }
}
