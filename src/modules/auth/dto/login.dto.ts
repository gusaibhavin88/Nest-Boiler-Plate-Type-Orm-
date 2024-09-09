import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class LogInDto {
  @IsEmail({}, { message: 'Invalid email address.' })
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  @MaxLength(50, {
    message: 'Password is too long. Maximum length is 50 characters.',
  })
  password: string;
}
