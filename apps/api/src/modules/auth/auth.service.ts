// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '@packages/db';
import { RegisterUserDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    const { email, password } = dto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!emailRegex.test(email)) {
      throw new ConflictException('Invalid email format');
    }

    const user = await this.supabaseService.createUser(email, password);
    const userId = user.id as string;

    if (!userId) {
      throw new InternalServerErrorException('Supabase user creation failed');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          id: userId,
          email,
        },
      });

      return user;
    } catch (error) {
      await this.supabaseService.deleteUser(userId);

      throw new InternalServerErrorException(
        `User creation failed, error: ${error}`,
      );
    }
  }

  async deleteUser(userId: string) {
    await this.supabaseService.deleteUser(userId);

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }
}
