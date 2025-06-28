export interface IOrganizationDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  inviteCode: string;
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
  industry?: string;
  size?: string;
  address?: string;
}
