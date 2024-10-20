import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import validateConfig from '@helpers/validate-config';
import { MailConfig } from './mail-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  MAIL_API_KEY: string;

  @IsString()
  DEFAULT_EMAIL: string;

  @IsString()
  DEFAULT_NAME: string;
}

export default registerAs<MailConfig>('mail', () => {
  return {
    defaultEmail: process.env.DEFAULT_EMAIL,
    defaultName: process.env.DEFAULT_NAME,
    apiKey: process.env.RESEND_EMAIL_API_KEY,
  };
});
