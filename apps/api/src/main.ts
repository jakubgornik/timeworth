import { initializeDiagnostics, reportStartupFailure } from './instrument';

async function start(): Promise<void> {
  initializeDiagnostics();
  // Load Nest and application modules after validation and instrumentation,
  // including modules that derive cookie settings from the environment.
  const { bootstrap } = await import('./bootstrap');
  await bootstrap();
}

void start().catch(reportStartupFailure);
