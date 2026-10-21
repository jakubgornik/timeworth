import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { STATUS_CODES } from 'node:http';
import { inspect } from 'node:util';
import * as Sentry from '@sentry/nestjs';

// Log the full cause with a request ID and return a safe, consistent HTTP error.
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();
    const requestId: string = res.locals.requestId ?? randomUUID();
    // Express parser errors are not Nest HttpExceptions. Keep their 4xx status,
    // while hiding parser messages that can contain fragments of the body.
    const parserStatus =
      exception && typeof exception === 'object' && 'statusCode' in exception
        ? exception.statusCode
        : undefined;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : typeof parserStatus === 'number' &&
            Number.isInteger(parserStatus) &&
            parserStatus >= 400 &&
            parserStatus < 500
          ? parserStatus
          : 500;
    const internal = status >= 500;

    if (internal || (exception instanceof Error && exception.cause)) {
      this.logger.error({
        requestId,
        method: req.method,
        path: req.path,
        error: inspect(exception, { depth: 6 }),
      });
    }
    if (internal) {
      Sentry.captureException(exception, { tags: { request_id: requestId } });
    }

    const response =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: STATUS_CODES[status] ?? 'Request failed' };
    const details =
      typeof response === 'string' ? { message: response } : response;
    const body = internal
      ? { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' }
      : {
          ...details,
          code:
            details && 'code' in details && typeof details.code === 'string'
              ? details.code
              : `HTTP_${status}`,
        };

    const adapter = this.adapterHost.httpAdapter;
    if (adapter.isHeadersSent(res)) {
      adapter.end(res);
      return;
    }
    res.setHeader('X-Request-Id', requestId);
    adapter.reply(res, { ...body, statusCode: status, requestId }, status);
  }
}
