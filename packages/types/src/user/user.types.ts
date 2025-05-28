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
