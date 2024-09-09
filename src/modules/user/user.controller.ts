import { Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { returnMessage } from 'src/utility/utilityFunctions';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Send-mail
  @Post('/send-mail')
  async sendMail(): Promise<any> {
    let responseData = await this.userService.sendMail();
    if (responseData) {
      throw new HttpException(
        {
          success: true,
          message: returnMessage('user', 'mailSent'),
        },
        HttpStatus.OK,
      );
    }
  }
}
