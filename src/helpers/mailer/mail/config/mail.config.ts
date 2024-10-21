import { registerAs } from '@nestjs/config';

import { MailConfig } from './mail-config.type';

export default registerAs<MailConfig>('mail', () => {
  return {
    defaultEmail: process.env.DEFAULT_EMAIL,
    defaultName: process.env.DEFAULT_NAME,
    apiKey: process.env.RESEND_EMAIL_API_KEY,
  };
});
