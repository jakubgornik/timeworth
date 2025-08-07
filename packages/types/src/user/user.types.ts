import { IOrganizationDto } from "../organization";

export const UserRole = {
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  AVAILABLE: "AVAILABLE",
  ASSIGNED: "ASSIGNED",
  ON_LEAVE: "ON_LEAVE",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUserDto {
  id: string;
  email: string;
  name?: string | null;
  bio?: string | null;
  status: UserStatusType;
  skills?: string[] | null;
}

export interface ICurrentUserDto extends IUserDto {
  organization: Omit<
    IOrganizationDto,
    "createdAt" | "updatedAt" | "inviteCode"
  > | null;
  role: UserRole;
}

export interface IUserCredentialsDto {
  email: string;
  password: string;
}

export interface UserStatusOption {
  label: string;
  value: UserStatusType;
}
