import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/model/user.model';
import { SignUpDto } from './dto/singUpDto';
import { CustomError } from 'src/helper/custom-error';
import * as bcrypt from 'bcryptjs';
import {
  passwordValidation,
  returnMessage,
  validateEmail,
} from 'src/utility/utilityFunctions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

  // Create Token
  jwtTokenGenerator(user: any): any {
    const data = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    return data;
  }

  // Sign Up Token
  async singUp(payload: SignUpDto, file: any) {
    try {
      const { email, password, username } = payload;

      if (!validateEmail(email)) {
        throw new CustomError(returnMessage('auth', 'invalidEmail'));
      }

      if (!passwordValidation(password)) {
        throw new CustomError(returnMessage('auth', 'invalidPassword'));
      }

      const existingUser = await this.userModel.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new CustomError(returnMessage('auth', 'alreadyExist'));
      }

      let image_path;
      if (file) {
        image_path = 'uploads/' + file?.filename; // Image upload
      } else if (file === '') {
        image_path = '';
      }

      const hashPassword = await bcrypt.hash(password, 10); // Hash Password

      const newUser = await this.userModel.create({
        email,
        password: hashPassword,
        username,
        profileImage: image_path,
      });

      await this.userModel.save(newUser);

      return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Login User
  async logInUser(payload: any): Promise<any> {
    try {
      const user = await this.userModel.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new CustomError(returnMessage('auth', 'notFound'));
      }

      const comparePassword = await bcrypt.compare(
        payload.password,
        user.password,
      );

      if (!comparePassword) {
        throw new CustomError(returnMessage('auth', 'invalidPassword'));
      }

      const userWithToken = await this.jwtTokenGenerator(user);

      return { token: userWithToken, ...user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
