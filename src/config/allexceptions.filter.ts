import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception?.response) {
      return response.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.response?.error ?? "Internal server error",
      });
    }
    return response.json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message ?? "Internal server error",
    });
  }
}
