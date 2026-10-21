import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { AuthenticatedUser } from '../auth/authenticated-user';
import { AuthEndpoint } from '../decorators/auth.decorator';

const UPLOAD_ATTEMPTS = 'uploadAttemptsPerMinute';
const WINDOW_MS = 60_000;

@Injectable()
export class UploadRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<
    string,
    { count: number; expiresAt: number }
  >();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    if (!request.user) throw new UnauthorizedException();
    const limit = this.reflector.get<number>(
      UPLOAD_ATTEMPTS,
      context.getHandler(),
    );
    const now = Date.now();
    const key = `${request.user.userId}:${context.getHandler().name}`;
    let entry = this.attempts.get(key);
    if (!entry || entry.expiresAt <= now) {
      for (const [oldKey, oldEntry] of this.attempts) {
        if (oldEntry.expiresAt <= now) this.attempts.delete(oldKey);
      }
      // Bound the per-process limiter itself when many accounts send requests.
      if (this.attempts.size >= 10_000) {
        context
          .switchToHttp()
          .getResponse<Response>()
          .setHeader('Retry-After', 60);
        throw new HttpException(
          'Upload capacity reached',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      entry = { count: 0, expiresAt: now + WINDOW_MS };
      this.attempts.set(key, entry);
    }
    if (++entry.count > limit) {
      context
        .switchToHttp()
        .getResponse<Response>()
        .setHeader('Retry-After', Math.ceil((entry.expiresAt - now) / 1000));
      throw new HttpException(
        'Too many upload attempts',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}

// Run authentication and throttling before Multer allocates the upload buffer.
export function RateLimitedUpload(attemptsPerMinute: number) {
  return applyDecorators(
    AuthEndpoint(),
    SetMetadata(UPLOAD_ATTEMPTS, attemptsPerMinute),
    UseGuards(UploadRateLimitGuard),
  );
}
