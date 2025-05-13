import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '@packages/db';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    if (!userId) {
      throw new InternalServerErrorException('Supabase user deletion failed');
    }

    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete Supabase user: ${error.message}`,
      );
    }

    return { message: 'User deleted successfully' };
  }

  async login(dto: LoginUserDto) {
    const { email, password } = dto;

    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found in DB');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,
    };
  }
}
