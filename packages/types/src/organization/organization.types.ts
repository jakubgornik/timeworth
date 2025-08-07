import { UserStatusType } from "../user";
import { IPaginatedQueryDto, ISearchDto } from "../utils";

export interface IOrganizationDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  inviteCode: string;
  managerId: string;
  industry?: string;
  size?: string;
  address?: string;
}

export interface IJoinOrganizationDto {
  userId: string;
  inviteCode: string;
}

export interface ICreateOrganizationDto {
  name: string;
  managerId: string;
  industry?: string;
  size?: string;
  address?: string;
}

export interface IOrganizationUsersFiltersDto {
  email?: string;
  userStatus?: UserStatusType[];
}

export type IPaginatedOrganizationUsersQueryDto =
  Partial<IOrganizationUsersFiltersDto> &
    ISearchDto &
    IPaginatedQueryDto & {
      managerId: string;
    };
