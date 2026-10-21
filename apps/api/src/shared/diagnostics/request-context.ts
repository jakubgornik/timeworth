import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import * as Sentry from '@sentry/nestjs';

// Give each request an ID shared by its response, error log and Sentry event.
export function requestContextMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  Sentry.withIsolationScope((scope) => {
    scope.setTag('request_id', requestId);
    next();
  });
}
