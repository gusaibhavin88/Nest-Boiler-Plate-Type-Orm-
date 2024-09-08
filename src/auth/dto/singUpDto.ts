import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'The username of the user.',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3, {
    message: 'Username is too short. Minimum length is 3 characters.',
  })
  @MaxLength(20, {
    message: 'Username is too long. Maximum length is 20 characters.',
  })
  username: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address.' })
  email: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'StrongP@ssw0rd!',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  @MaxLength(50, {
    message: 'Password is too long. Maximum length is 50 characters.',
  })
  password: string;
}
