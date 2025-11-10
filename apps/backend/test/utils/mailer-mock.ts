import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerMock {
  public sendMail = jest.fn().mockResolvedValue(true);
}
