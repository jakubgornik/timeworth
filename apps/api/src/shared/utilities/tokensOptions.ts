export const COOKIE_OPTIONS = {
  accessToken: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 1, // 1 minutes
  },
  refreshToken: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};
