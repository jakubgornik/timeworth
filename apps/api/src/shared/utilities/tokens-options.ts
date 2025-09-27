const isProd = process.env.NODE_ENV === 'production';

export const COOKIE_OPTIONS = {
  accessToken: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    path: '/',
    domain: isProd ? '.timeworth.site' : undefined,
  },
  refreshToken: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/',
    domain: isProd ? '.timeworth.site' : undefined,
  },
};
