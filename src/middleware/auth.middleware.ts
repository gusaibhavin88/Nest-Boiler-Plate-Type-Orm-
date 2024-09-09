import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/modules/user/model/user.model';
// import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };

      const currentUser = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!currentUser) {
        throw new UnauthorizedException('User not found');
      }

      req['user'] = currentUser;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
