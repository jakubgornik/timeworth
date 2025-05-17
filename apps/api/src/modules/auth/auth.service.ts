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
import { Response } from 'express';
import { randomBytes } from 'crypto';
import { hashToken } from 'src/shared/utilities/hashToken';
import { Request } from 'express';
import { COOKIE_OPTIONS } from 'src/shared/utilities/tokensOptions';

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

  async login(dto: LoginUserDto, res: Response) {
    const { email, password } = dto;

    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: data.user.id, email: data.user.email };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = randomBytes(64).toString('hex');
    const hashedRefreshToken = hashToken(refreshToken);

    const [user] = await this.prisma.$transaction([
      this.prisma.user.findUniqueOrThrow({
        where: { id: data.user.id },
      }),
      this.prisma.refreshToken.create({
        data: {
          token: hashedRefreshToken,
          userId: data.user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      }),
    ]);

    res.cookie('access_token', accessToken, COOKIE_OPTIONS.accessToken);

    res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS.refreshToken);

    return { user };
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      const hashed = hashToken(refreshToken);

      await this.prisma.refreshToken.update({
        where: { token: hashed },
        data: { revoked: true },
      });
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  async refreshTokens(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const hashedRefreshToken = hashToken(refreshToken);

    const storedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedRefreshToken },
      include: { user: true },
    });

    if (
      !storedRefreshToken ||
      storedRefreshToken.revoked ||
      new Date() > new Date(storedRefreshToken.expiresAt)
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = storedRefreshToken.user;

    await this.prisma.refreshToken.update({
      where: { token: hashedRefreshToken },
      data: { revoked: true },
    });

    const newRefreshToken = randomBytes(64).toString('hex');
    const newHashedRefreshToken = hashToken(newRefreshToken);

    await this.prisma.refreshToken.create({
      data: {
        token: newHashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const newAccessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    res.cookie('access_token', newAccessToken, COOKIE_OPTIONS.accessToken);

    res.cookie('refresh_token', newRefreshToken, COOKIE_OPTIONS.refreshToken);

    return { message: 'Tokens refreshed' };
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
}
