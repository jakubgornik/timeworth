export interface IUserDto {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
}
