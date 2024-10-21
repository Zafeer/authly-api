import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly transporter: any;
  constructor(private readonly configService: ConfigService) {
    this.transporter = new Resend(this.configService.get('mail.apiKey'));
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: any & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.emails.send({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `${this.configService.get('mail.defaultName')} <${this.configService.get('mail.defaultEmail')}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
