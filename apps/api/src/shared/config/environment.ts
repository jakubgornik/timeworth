import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';

export const ROOT_ENV_PATH = resolve(__dirname, '../../../../../.env');

// Validate startup settings and normalize defaults without exposing secret values.
export function validateEnvironment(env: Record<string, unknown>) {
  const errors: string[] = [];
  const required = [
    'JWT_SECRET',
    'DATABASE_URL',
    'DIRECT_URL',
    'CORS_ORIGIN',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_S3_ENDPOINT',
    'SUPABASE_S3_REGION',
    'SUPABASE_S3_ACCESS_KEY_ID',
    'SUPABASE_S3_SECRET_ACCESS_KEY',
    'SUPABASE_STORAGE_DEFAULT_BUCKET',
  ];
  for (const key of required) {
    if (typeof env[key] !== 'string' || !env[key].trim()) {
      errors.push(`${key} is required`);
    }
  }

  const nodeEnv = env.NODE_ENV ?? 'development';
  if (!['development', 'production', 'test'].includes(String(nodeEnv))) {
    errors.push('NODE_ENV must be development, production or test');
  }
  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push('PORT must be an integer between 1 and 65535');
  }
  if (
    nodeEnv === 'production' &&
    (typeof env.JWT_SECRET !== 'string' || env.JWT_SECRET.length < 32)
  ) {
    errors.push('JWT_SECRET must contain at least 32 characters in production');
  }

  function validUrl(value: unknown, protocols: string[]): boolean {
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
      const url = new URL(value);
      return protocols.includes(url.protocol) && Boolean(url.hostname);
    } catch {
      return false;
    }
  }
  for (const key of ['DATABASE_URL', 'DIRECT_URL']) {
    if (!validUrl(env[key], ['postgres:', 'postgresql:'])) {
      errors.push(`${key} must be a PostgreSQL URL`);
    }
  }
  for (const key of ['SUPABASE_URL', 'SUPABASE_S3_ENDPOINT']) {
    if (!validUrl(env[key], ['http:', 'https:'])) {
      errors.push(`${key} must be an HTTP(S) URL`);
    }
  }
  if (env.SENTRY_DSN) {
    let validDsn = false;
    if (validUrl(env.SENTRY_DSN, ['http:', 'https:'])) {
      const dsn = new URL(String(env.SENTRY_DSN));
      validDsn =
        Boolean(dsn.username) && /^\/(?:[^/]+\/)*\d+$/.test(dsn.pathname);
    }
    if (!validDsn) {
      errors.push('SENTRY_DSN must be empty or a valid HTTP(S) Sentry DSN');
    }
  }

  const origins: string[] = [];
  if (typeof env.CORS_ORIGIN === 'string') {
    for (const value of env.CORS_ORIGIN.split(',').map((item) => item.trim())) {
      try {
        const url = new URL(value);
        if (
          !['http:', 'https:'].includes(url.protocol) ||
          url.pathname !== '/' ||
          url.search ||
          url.hash ||
          url.username ||
          url.password
        ) {
          throw new Error();
        }
        origins.push(url.origin);
      } catch {
        errors.push('CORS_ORIGIN must contain explicit HTTP(S) origins');
      }
    }
  }

  if (errors.length) {
    // Report variable names and rules, never supplied secrets or URL values.
    throw new Error(`Invalid API configuration:\n${errors.join('\n')}`);
  }
  return {
    ...env,
    NODE_ENV: String(nodeEnv),
    PORT: port,
    CORS_ORIGIN: [...new Set(origins)].join(','),
    SENTRY_DSN: typeof env.SENTRY_DSN === 'string' ? env.SENTRY_DSN : '',
  };
}

export function loadEnvironment() {
  loadDotenv({ path: ROOT_ENV_PATH });
  return validateEnvironment(process.env);
}
