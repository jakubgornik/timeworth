import { IMembershipDto } from "../membership";

export interface IUserDto {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCredentialsDto {
  email: string;
  password: string;
}

export interface ICurrentUserDto extends IUserDto {
  memberships: IMembershipDto[];
}
