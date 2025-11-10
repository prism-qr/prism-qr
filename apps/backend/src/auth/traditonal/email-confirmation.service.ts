import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class EmailConfirmationService {
  private readonly logger = new Logger(EmailConfirmationService.name);
  constructor(private readonly mailerService: MailerService) {}

  public async sendConfirmationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const confirmationUrl = `${getEnvConfig().internal.backendUrl}/auth/traditional/confirm-email?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirm your email - Prism QR',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Prism QR!</h2>
          <p>Please confirm your email address by clicking the button below:</p>
          <div style="margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6B7280; word-break: break-all;">${confirmationUrl}</p>
          <p style="margin-top: 40px; color: #6B7280; font-size: 14px;">
            If you didn't create an account with Prism QR, you can safely ignore this email.
          </p>
        </div>
      `,
      });
      this.logger.log(`Sent confirmation email to ${email}`);
    } catch (error) {
      this.logger.error('Failed to send confirmation email', error);
    }
  }
}
