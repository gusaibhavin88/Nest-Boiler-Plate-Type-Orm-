import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { returnMessage } from 'src/utility/utilityFunctions';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Get user-mail
  @Get('/get-user')
  async getUser(@Req() req: any): Promise<any> {
    let responseData = await this.userService.getUser(req?.user);
    if (responseData) {
      throw new HttpException(
        {
          success: true,
          message: returnMessage('user', 'userFetched'),
          data: responseData,
        },
        HttpStatus.OK,
      );
    }
  }

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
