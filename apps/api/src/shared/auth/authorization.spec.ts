import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from './authenticated-user';
import { requireManagerOrganization } from './authorization';

describe('Organization authorization', () => {
  const manager: AuthenticatedUser = {
    userId: 'manager-1',
    email: 'manager@example.com',
    role: 'MANAGER',
    organizationId: 'org-1',
    organizationManagerId: 'manager-1',
  };

  it('should allow the manager of the current organization', () => {
    expect(requireManagerOrganization(manager)).toBe('org-1');
  });

  it.each<Partial<AuthenticatedUser>>([
    { role: 'EMPLOYEE' },
    { organizationId: null },
    { organizationManagerId: 'another-manager' },
  ])('should reject an unauthorized user: %j', (overrides) => {
    expect(() =>
      requireManagerOrganization({ ...manager, ...overrides }),
    ).toThrow(ForbiddenException);
  });
});
