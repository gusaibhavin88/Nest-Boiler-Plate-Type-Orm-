import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly mailService: MailerService) {}

  // Get User
  async getUser(user: any): Promise<any> {
    try {
      return user;
    } catch (error) {
      Logger.error('Error while send mail');
      throw new BadRequestException(error.message);
    }
  }

  // Send Mail
  async sendMail(): Promise<any> {
    try {
      return this.mailService.sendMail({
        to: 'jerry@yopmail.com',
        from: process.env.EMAIL_USERNAME,
        subject: 'Test Message',
        html: 'Test Message',
      });
    } catch (error) {
      Logger.error('Error while send mail');
      throw new BadRequestException(error.message);
    }
  }
}
