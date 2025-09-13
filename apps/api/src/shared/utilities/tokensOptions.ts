const isProd = process.env.NODE_ENV === 'production';

export const COOKIE_OPTIONS = {
  accessToken: {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'lax' | 'strict' | 'none',
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  },
  refreshToken: {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'lax' | 'strict' | 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};
