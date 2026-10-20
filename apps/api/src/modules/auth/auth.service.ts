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
import { hashToken } from '../../shared/utilities/hash-token';
import { Request } from 'express';
import {
  COOKIE_CLEAR_OPTIONS,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_TTL_MS,
} from '../../shared/utilities/tokens-options';

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

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
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

    const refreshToken = randomBytes(64).toString('hex');
    const hashedRefreshToken = hashToken(refreshToken);
    const { user, accessToken } = await this.prisma.$transaction(async (tx) => {
      // Serialize token creation for one account without changing profile fields.
      // NO KEY UPDATE permits foreign-key checks while this lock is held.
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${data.user.id} FOR NO KEY UPDATE`;
      const user = await tx.user.findUniqueOrThrow({
        where: { id: data.user.id },
      });
      await tx.refreshToken.updateMany({
        where: { userId: user.id, revoked: false },
        data: { revoked: true },
      });
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
      await tx.refreshToken.create({
        data: {
          token: hashedRefreshToken,
          userId: user.id,
          expiresAt,
        },
      });
      const accessToken = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });
      return { user, accessToken };
    });

    this.setTokenCookies(res, accessToken, refreshToken);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async logout(req: Request, res: Response) {
    const refreshToken = this.readRefreshToken(req);
    try {
      if (refreshToken) {
        await this.prisma.refreshToken.updateMany({
          where: { token: hashToken(refreshToken), revoked: false },
          data: { revoked: true },
        });
      }
    } catch {
      throw new InternalServerErrorException('Logout failed');
    } finally {
      for (const name of ['access_token', 'refresh_token']) {
        res.clearCookie(name, COOKIE_CLEAR_OPTIONS);
      }
    }

    return { message: 'Logged out successfully' };
  }

  async refreshTokens(req: Request, res: Response) {
    const refreshToken = this.readRefreshToken(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const hashedRefreshToken = hashToken(refreshToken);

    const newRefreshToken = randomBytes(64).toString('hex');
    const newHashedRefreshToken = hashToken(newRefreshToken);

    try {
      const newAccessToken = await this.prisma.$transaction(async (tx) => {
        const stored = await tx.refreshToken.findUnique({
          where: { token: hashedRefreshToken },
          include: { user: true },
        });
        if (!stored) throw new UnauthorizedException('Invalid refresh token');

        // Use the same account lock as login so a concurrent login cannot
        // miss a successor created by an old refresh after revoking its predecessor.
        await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${stored.userId} FOR NO KEY UPDATE`;

        // PostgreSQL rechecks this predicate after waiting for a competing update.
        const consumed = await tx.refreshToken.updateMany({
          where: {
            token: hashedRefreshToken,
            revoked: false,
            // Recheck expiration after waiting for the account lock.
            expiresAt: { gt: new Date() },
          },
          data: { revoked: true },
        });
        if (consumed.count !== 1)
          throw new UnauthorizedException('Invalid refresh token');

        await tx.refreshToken.create({
          data: {
            token: newHashedRefreshToken,
            userId: stored.userId,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
          },
        });
        return this.jwtService.sign({
          sub: stored.user.id,
          email: stored.user.email,
        });
      });

      // Never clear cookies on a losing refresh: another tab may have rotated them.
      this.setTokenCookies(res, newAccessToken, newRefreshToken);

      return { message: 'Tokens refreshed successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Token refresh failed');
    }
  }

  private readRefreshToken(req: Request): string | undefined {
    const token: unknown = req.cookies?.refresh_token;
    return typeof token === 'string' && token.length > 0 ? token : undefined;
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('access_token', accessToken, COOKIE_OPTIONS.accessToken);
    res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS.refreshToken);
  }

  async deleteUser(userId: string) {
    if (!userId) {
      throw new InternalServerErrorException('Supabase user deletion failed');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.user.delete({
          where: { id: userId },
        });

        await this.supabaseService.deleteUser(userId);
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete user: ${error.message}`,
      );
    }
  }
}
