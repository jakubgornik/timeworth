import { UserRole } from '@packages/db';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string | null;
  organizationManagerId: string | null;
}
