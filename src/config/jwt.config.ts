import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessToken: process.env.ACCESS_TOKEN || 'accessToken_secret',
  refreshToken: process.env.REFRESH_TOKEN || 'refreshToken_secret',
  jwtExpAccessToken: process.env.ACCESS_TOKEN_EXP || 60 * 60, // 1h
  otpTokenExpiry: process.env.OTP_TOKEN_EXPIRY || 60 * 10, // 10m
  jwtExpRefreshToken: process.env.REFRESH_TOKEN_EXP || 60 * 60 * 24 * 10, // 10d
  jwtLinkExpAccessToken: process.env.LINK_TOKEN_EXP || 60 * 60 * 24 * 15, // 15d
}));
