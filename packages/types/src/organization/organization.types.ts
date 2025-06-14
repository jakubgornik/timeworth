export interface IOrganizationDto {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  address?: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}
