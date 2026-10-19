import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@packages/db';
import { AuthenticatedUser } from './authenticated-user';

export function requireOrganization(user: AuthenticatedUser): string {
  if (!user.organizationId) {
    throw new ForbiddenException('Organization membership required');
  }
  return user.organizationId;
}

export function requireManagerOrganization(user: AuthenticatedUser): string {
  const organizationId = requireOrganization(user);
  if (
    user.role !== UserRole.MANAGER ||
    user.organizationManagerId !== user.userId
  ) {
    throw new ForbiddenException('Organization manager access required');
  }
  return organizationId;
}
