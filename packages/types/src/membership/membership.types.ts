import { IOrganizationDto } from "../organization";
import { UserRole } from "@packages/db";

export interface IMembershipDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  organizationId: string;
  userId: string;
  organization: IOrganizationDto;
}
