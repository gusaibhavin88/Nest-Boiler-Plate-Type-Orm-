import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SignUpDto } from './dto/singUpDto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from 'src/config/multer.config';
import { returnMessage } from 'src/utility/utilityFunctions';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth Service')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign Up User
  @Post('/sign-up')
  @ApiConsumes('multipart/form-data') // Indicates the type of data being consumed
  @ApiBody({
    description: 'Sign up user with form data',
    type: SignUpDto,
  })
  @UseInterceptors(
    FileInterceptor('image', { ...multerConfig, ...multerOptions }),
  )
  async singUp(
    @Body() reqBody: SignUpDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    let responseData = await this.authService.singUp(reqBody, image);
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

  // Log In User
  @Post('/log-in')
  async logIn(@Body() reqBody: LogInDto, @Req() request: any): Promise<any> {
    let responseData = await this.authService.logInUser(reqBody);
    if (responseData) {
      throw new HttpException(
        {
          success: true,
          message: returnMessage('auth', 'loggedIn'),
          data: responseData,
        },
        HttpStatus.OK,
      );
    }
  }
}
