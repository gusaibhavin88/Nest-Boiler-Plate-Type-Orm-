import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { SignUpDto } from './dto/singUpDto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { returnMessage } from 'utility/utilityFunctions';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign Up User
  @Post('/sign-up')
  async singUp(@Body() reqBody: SignUpDto, @Req() request: any): Promise<any> {
    let responseData = await this.authService.singUp(reqBody);
    if (responseData) {
      throw new HttpException(
        {
          success: true,
          message: 'Users registered successfully',
          data: responseData,
        },
        HttpStatus.OK,
      );
    }
  }

  // Log In User
  @Post('/log-in')
  async logIn(@Body() reqBody: LogInDto, @Req() request: any): Promise<any> {
    let responseData = await this.authService.logInUser(reqBody);
    if (responseData) {
      throw new HttpException(
        {
          success: true,
          message: returnMessage('auth', 'registered'),
          data: responseData,
        },
        HttpStatus.OK,
      );
    }
  }
}
