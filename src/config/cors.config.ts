import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  enabled: process.env.ENABLE_CORS || true,
}));
