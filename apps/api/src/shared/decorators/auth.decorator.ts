import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function AuthEndpoint() {
  return applyDecorators(UseGuards(AuthGuard('jwt')));
}
