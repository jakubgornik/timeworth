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
