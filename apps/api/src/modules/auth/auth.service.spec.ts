import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@packages/db';
import { Request, Response } from 'express';
import { hashToken } from '../../shared/utilities/hash-token';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  COOKIE_CLEAR_OPTIONS,
  REFRESH_TOKEN_TTL_MS,
} from '../../shared/utilities/tokens-options';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from './auth.service';

describe('AuthService token rotation', () => {
  const user = { id: 'user-1', email: 'user@example.com' };
  const refreshToken = 'refresh-token';
  const jwt = new JwtService({
    secret: 'tw007-test-secret',
    signOptions: { expiresIn: ACCESS_TOKEN_TTL_SECONDS },
  });
  let service: AuthService;
  let response: Response;
  let revoked: boolean;
  let expiresAt: Date;
  let prisma: {
    $transaction: jest.Mock;
    $queryRaw: jest.Mock;
    user: { findUniqueOrThrow: jest.Mock };
    refreshToken: {
      findUnique: jest.Mock;
      updateMany: jest.Mock;
      create: jest.Mock;
    };
  };
  const req = (
    cookies: Record<string, unknown> = { refresh_token: refreshToken },
  ) => ({ cookies }) as Request;

  beforeEach(() => {
    revoked = false;
    expiresAt = new Date(Date.now() + 60000);
    prisma = {
      $transaction: jest.fn(),
      $queryRaw: jest.fn().mockResolvedValue([{ id: user.id }]),
      user: { findUniqueOrThrow: jest.fn().mockResolvedValue(user) },
      refreshToken: {
        findUnique: jest
          .fn()
          .mockImplementation(({ where }) =>
            where.token === hashToken(refreshToken)
              ? { userId: user.id, user, revoked, expiresAt }
              : null,
          ),
        updateMany: jest.fn().mockImplementation(({ where }) => {
          if (
            where.token &&
            (where.token !== hashToken(refreshToken) ||
              revoked ||
              (where.expiresAt && expiresAt <= where.expiresAt.gt))
          )
            return { count: 0 };
          revoked = true;
          return { count: 1 };
        }),
        create: jest.fn().mockResolvedValue({ id: 'next-token' }),
      },
    };
    prisma.$transaction.mockImplementation((operation) => operation(prisma));
    const supabase = {
      client: {
        auth: {
          signInWithPassword: jest
            .fn()
            .mockResolvedValue({ data: { user }, error: null }),
        },
      },
    };
    service = new AuthService(
      supabase as unknown as SupabaseService,
      prisma as unknown as PrismaService,
      jwt,
    );
    response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;
  });

  it('issues ordinary access JWTs and matches cookie/token lifetimes on login', async () => {
    await service.login(
      { email: user.email, password: 'Password123!' },
      response,
    );
    const cookies = response.cookie as jest.Mock;
    const access = cookies.mock.calls.find(
      ([name]) => name === 'access_token',
    )!;
    const payload = jwt.verify<{
      sub: string;
      email: string;
      exp: number;
      iat: number;
      sid?: string;
    }>(access[1] as string);
    expect(payload).toMatchObject({ sub: user.id, email: user.email });
    expect(payload.sid).toBeUndefined();
    expect(payload.exp - payload.iat).toBe(ACCESS_TOKEN_TTL_SECONDS);
    expect(access[2]).toEqual({
      ...COOKIE_CLEAR_OPTIONS,
      maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
    });
    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      expect.any(String),
      { ...COOKIE_CLEAR_OPTIONS, maxAge: REFRESH_TOKEN_TTL_MS },
    );
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: user.id, revoked: false },
      data: { revoked: true },
    });
    const next = prisma.refreshToken.create.mock.calls[0][0].data as {
      token: string;
      userId: string;
    };
    const raw = cookies.mock.calls.find(
      ([name]) => name === 'refresh_token',
    )![1] as string;
    expect(next.token).toBe(hashToken(raw));
    expect(next.userId).toBe(user.id);
  });

  it('honors conditional consumption so simultaneous calls create at most one successor', async () => {
    const outcomes = await Promise.allSettled([
      service.refreshTokens(req(), response),
      service.refreshTokens(req(), response),
    ]);
    expect(
      outcomes.filter((outcome) => outcome.status === 'fulfilled'),
    ).toHaveLength(1);
    const rejected = outcomes.find(
      (outcome) => outcome.status === 'rejected',
    ) as PromiseRejectedResult;
    expect(rejected.reason).toBeInstanceOf(UnauthorizedException);
    expect(prisma.refreshToken.create).toHaveBeenCalledTimes(1);
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: {
        token: hashToken(refreshToken),
        revoked: false,
        expiresAt: { gt: expect.any(Date) },
      },
      data: { revoked: true },
    });
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(response.clearCookie).not.toHaveBeenCalled();
  });

  it.each(['missing', 'empty', 'malformed', 'unknown', 'expired', 'revoked'])(
    'rejects %s refresh credentials without changing cookies',
    async (state) => {
      if (state === 'expired') expiresAt = new Date(Date.now() - 1);
      if (state === 'revoked') revoked = true;
      const token =
        { empty: '', malformed: {}, unknown: 'unknown' }[state] ?? refreshToken;
      await expect(
        service.refreshTokens(
          req(state === 'missing' ? {} : { refresh_token: token }),
          response,
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      expect(response.cookie).not.toHaveBeenCalled();
      expect(response.clearCookie).not.toHaveBeenCalled();
    },
  );

  it('rejects token reuse after successful rotation without clearing the winner’s cookies', async () => {
    await service.refreshTokens(req(), response);
    await expect(service.refreshTokens(req(), response)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(prisma.refreshToken.create).toHaveBeenCalledTimes(1);
    expect(response.clearCookie).not.toHaveBeenCalled();
  });

  it('reports a failed transaction without setting cookies or exposing database errors', async () => {
    prisma.refreshToken.create.mockRejectedValue(
      new Error('private-database-details'),
    );
    await expect(service.refreshTokens(req(), response)).rejects.toThrow(
      'Token refresh failed',
    );
    expect(response.cookie).not.toHaveBeenCalled();
    expect(response.clearCookie).not.toHaveBeenCalled();
  });

  it.each(['missing', 'unknown', 'known', 'already-revoked'])(
    'clears cookies for %s credentials on repeated logout',
    async (state) => {
      if (state === 'already-revoked') revoked = true;
      const cookies =
        state === 'missing'
          ? {}
          : { refresh_token: state === 'unknown' ? 'unknown' : refreshToken };
      for (let attempt = 0; attempt < 2; attempt++) {
        await expect(service.logout(req(cookies), response)).resolves.toEqual({
          message: 'Logged out successfully',
        });
        expect(response.clearCookie).toHaveBeenCalledWith(
          'access_token',
          COOKIE_CLEAR_OPTIONS,
        );
        expect(response.clearCookie).toHaveBeenCalledWith(
          'refresh_token',
          COOKIE_CLEAR_OPTIONS,
        );
      }
    },
  );

  it('clears cookies even when token revocation fails', async () => {
    prisma.refreshToken.updateMany.mockRejectedValue(
      new Error('database unavailable'),
    );
    await expect(service.logout(req(), response)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(response.clearCookie).toHaveBeenCalledWith(
      'access_token',
      COOKIE_CLEAR_OPTIONS,
    );
    expect(response.clearCookie).toHaveBeenCalledWith(
      'refresh_token',
      COOKIE_CLEAR_OPTIONS,
    );
  });

  it('does not need a database connection to log out without a refresh token', async () => {
    prisma.refreshToken.updateMany.mockRejectedValue(new Error('offline'));
    await expect(service.logout(req({}), response)).resolves.toEqual({
      message: 'Logged out successfully',
    });
    expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('revokes the submitted refresh token but leaves a copied access JWT valid until expiration', async () => {
    const access = jwt.sign({ sub: user.id, email: user.email });
    await service.logout(
      req({ refresh_token: refreshToken, access_token: access }),
      response,
    );
    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { token: hashToken(refreshToken), revoked: false },
      data: { revoked: true },
    });
    expect(jwt.verify<{ sub: string }>(access).sub).toBe(user.id);
  });

  it('uses the same account lock for login and refresh without changing profile fields', async () => {
    await service.login(
      { email: user.email, password: 'Password123!' },
      response,
    );
    revoked = false;
    await service.refreshTokens(req(), response);
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(2);
    for (const [query, boundUserId] of prisma.$queryRaw.mock.calls as [
      TemplateStringsArray,
      string,
    ][]) {
      expect(query.join('?')).toContain('FOR NO KEY UPDATE');
      expect(boundUserId).toBe(user.id);
    }
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: user.id },
    });
  });

  it('rejects a token that expires while waiting for the account lock', async () => {
    const start = Date.now();
    jest.useFakeTimers({ now: start });
    expiresAt = new Date(start + 100);
    prisma.$queryRaw.mockImplementation(() => {
      jest.setSystemTime(start + 200);
      return [];
    });
    try {
      await expect(service.refreshTokens(req(), response)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prisma.refreshToken.create).not.toHaveBeenCalled();
      expect(response.cookie).not.toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
    }
  });
});
