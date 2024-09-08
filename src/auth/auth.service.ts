import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/model/user.model';
import { SignUpDto } from './dto/singUpDto';
import { passwordValidation, validateEmail } from 'config/utility';
import { CustomError } from 'filters/custom-error';
import * as bcrypt from 'bcryptjs';

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
  async singUp(payload: SignUpDto) {
    try {
      const { email, password, username } = payload;

      if (!validateEmail(email)) {
        throw new CustomError('Invalid email');
      }

      if (!passwordValidation(password)) {
        throw new CustomError('Invalid password');
      }

      const existingUser = await this.userModel.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new CustomError('User already exist');
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await this.userModel.create({
        email,
        password: hashPassword,
        username,
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
      const comparePassword = await bcrypt.compare(
        payload.password,
        user.password,
      );

      if (!comparePassword) {
        throw new CustomError('Invalid password');
      }

      if (!user) {
        throw new CustomError('User not found');
      }

      const userWithToken = await this.jwtTokenGenerator(user);

      return { token: userWithToken, ...user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
