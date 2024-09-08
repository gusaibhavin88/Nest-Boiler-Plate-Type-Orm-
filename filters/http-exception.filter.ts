import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let responseBody: any = {
      statusCode: status,
      // timestamp: new Date().toISOString(),
      // path: request.url,
    };

    if (typeof exceptionResponse === 'object') {
      responseBody = { ...responseBody, ...exceptionResponse };
    } else {
      responseBody.message = exceptionResponse;
    }

    response.status(status).json(responseBody);
  }
}
