import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('app', () => ({
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  loggerLevel: process.env.APP_LOGGER_LEVEL || 'trace',
  workingDirectory: process.env.PWD || process.cwd(),
  env: process.env.NODE_ENV || 'development',
  // eslint-disable-next-line global-require,@typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  version: require(path.join(process.cwd(), 'package.json')).version,
  cors: {
    enabled: true,
  },
  name: process.env.APP_NAME || 'app',
  port: process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000,
  fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
  headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
}));
