import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';

import { MaybeType } from '@helpers/types/maybe.type';
import { MailerService } from '../mailer/mailer.service';
import * as path from 'path';
import { AppConfig } from '@config/app-config.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
        i18n.t('reset-password.text4'),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${resetPasswordTitle}`,
      templatePath: path.join(
        this.configService.get('workingDirectory', {
          infer: true,
        }),
        'src',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle,
        // url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async confirmNewEmail(mailData: MailData<{ otp: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let emailConfirmTitle: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle] = await Promise.all([i18n.t('common.confirmEmail')]);
    }

    await this.mailerService.sendMail({
      to: [mailData.to],
      subject: 'Confirm Email',
      templatePath: path.join(
        this.configService.get('app.workingDirectory'),
        'src',
        'helpers',
        'mailer',
        'mail',
        'mail-templates',
        'confirm-new-email.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name'),
        text1: mailData?.data?.otp,
      },
    });
  }

  async forgotPasswordEmail(
    mailData: MailData<{ otp: string }>,
  ): Promise<void> {
    const i18n = I18nContext.current();
    let emailResetPasswordTitle: MaybeType<string>;

    if (i18n) {
      [emailResetPasswordTitle] = await Promise.all([
        i18n.t('common.resetPassword'),
      ]);
    }

    await this.mailerService.sendMail({
      to: [mailData.to],
      subject: 'Reset Password',
      templatePath: path.join(
        this.configService.get('app.workingDirectory'),
        'src',
        'helpers',
        'mailer',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: emailResetPasswordTitle,
        actionTitle: emailResetPasswordTitle,
        app_name: this.configService.get('app.name'),
        text1: mailData?.data?.otp,
      },
    });
  }
}
