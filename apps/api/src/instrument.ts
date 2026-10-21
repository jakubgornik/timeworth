import * as Sentry from '@sentry/nestjs';
import { inspect } from 'node:util';
import { loadEnvironment } from './shared/config/environment';

export function initializeDiagnostics(): void {
  const env = loadEnvironment();
  if (env.NODE_ENV === 'production' && typeof env.SENTRY_DSN === 'string') {
    if (!env.SENTRY_DSN) return;
    Sentry.init({
      dsn: env.SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
    });
  }
}

export async function reportStartupFailure(error: unknown): Promise<never> {
  console.error('API startup failed:', inspect(error, { depth: 6 }));
  try {
    Sentry.captureException(error, { tags: { phase: 'startup' } });
    await Sentry.flush(2000);
  } finally {
    process.exit(1);
  }
}
