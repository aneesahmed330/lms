import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';

import { IMailService } from './mail.service';
import { IMail } from 'libs/building-block/Interfaces/mail.interface';

@Injectable()
export class MailManagerService implements IMailService {
  constructor() {}
  async sendMail(data: IMail): Promise<string> {
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_MAIL_HOST,
      port: +process.env.ZOHO_MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.ZOHO_MAIL_USER,
        pass: process.env.ZOHO_MAIL_PASSWORD,
      },
    });
    try {
      await transporter.sendMail({
        from: process.env.ZOHO_MAIL_ACCOUNT,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data?.html,
        attachments: data?.attachments,
      });
      return 'Mail send successfully';
    } catch (error) {
      Logger.error('Error in sending mail');
      Logger.error(`[-] ERROR: ${JSON.stringify(error)}`);
    }
  }
}
