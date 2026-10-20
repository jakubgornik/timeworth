import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class TrustedOriginGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return true;

    const origin = req.get('origin');
    const trustedOrigins = (this.config.get<string>('CORS_ORIGIN') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value && value !== 'null' && value !== '*');
    if (origin && trustedOrigins.includes(origin)) return true;
    throw new ForbiddenException('Untrusted request origin');
  }
}
