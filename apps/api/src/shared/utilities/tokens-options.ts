const isProd = process.env.NODE_ENV === 'production';

export const ACCESS_TOKEN_TTL_SECONDS = 2 * 60 * 60;
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
};

export const COOKIE_OPTIONS = {
  accessToken: {
    ...COOKIE_CLEAR_OPTIONS,
    maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
  },
  refreshToken: {
    ...COOKIE_CLEAR_OPTIONS,
    maxAge: REFRESH_TOKEN_TTL_MS,
  },
};
