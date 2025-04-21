export interface IUserDto {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
}
