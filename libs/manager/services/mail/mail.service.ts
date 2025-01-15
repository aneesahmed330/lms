import { IMail } from 'libs/building-block/Interfaces/mail.interface';

export abstract class IMailService {
  abstract sendMail(data: IMail): Promise<string>;
}
