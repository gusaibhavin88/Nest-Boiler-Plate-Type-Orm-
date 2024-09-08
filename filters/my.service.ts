import { Injectable } from '@nestjs/common';
import { CustomError } from './custom-error';

@Injectable()
export class MyService {
  someMethod() {
    throw new CustomError('This is a custom error message');
  }
}
