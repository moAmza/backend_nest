import { Injectable } from '@nestjs/common';
import { OutStatusDto } from 'src/dtos/out-status.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { TypeFullVerifier } from '../auth/dtos/type-full-verifier.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  setText = (title: string, code: number) => {
    const text = `Hi ${title}!
    Your verification code is ${code}.
    Enter this code in our High5 to activate your fantasy account.
    Click here ${'google.com'} to open the High5.
    If you have any questions, send us an email ${'rahnema.high5@gmail.com'}.
    We’re glad you’re here!
    The ${'High5'} team`;

    return text;
  };

  async sendVerifierEmail(verifier: TypeFullVerifier): Promise<OutStatusDto> {
    await this.mailerService.sendMail({
      from: 'rahnema.high5@gmail.com',
      to: verifier.email,
      subject: 'High5 Confirmation',
      text: this.setText(verifier.userInfo.firstname, verifier.code),
    });

    return { status: true };
  }
}
