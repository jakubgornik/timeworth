import { IOrganizationDto } from "../organization";

export const UserRole = {
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUserDto {
  id: string;
  email: string;
  name?: string | null;
}

export interface ICurrentUserDto extends IUserDto {
  organization: IOrganizationDto | null;
  role: UserRole;
}

export interface IUserCredentialsDto {
  email: string;
  password: string;
}
