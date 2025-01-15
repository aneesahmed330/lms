import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ServiceError } from './service-error';

export interface ApiError {
  id: string;
  domain: string;
  message: string;
  timestamp: Date;
}

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    let body: ApiError;
    let status: HttpStatus;

    if (exception instanceof ServiceError) {
      // Straightforward handling of our own exceptions
      body = {
        id: exception.id,
        message: exception.apiMessage,
        domain: exception.domain,
        timestamp: exception.timestamp,
      };
      status = exception.status;
    } else if (exception instanceof BadRequestException) {
      const message =
        typeof exception.getResponse() === 'object'
          ? (exception.getResponse() as unknown as any)?.message
          : exception.message;

      body = new ServiceError(
        'generic',
        message,
        message,
        HttpStatus.BAD_REQUEST,
      );
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      // We can extract internal message & status from NestJS errors
      // Useful with class-validator
      body = new ServiceError(
        'generic',
        exception.message,
        exception.message, // Or generic message if you like
        exception.getStatus(),
      );
      status = exception.getStatus();
    } else {
      Logger.log('exception  =>', exception);
      // For all other exceptions simply return 500 error
      body = new ServiceError(
        'generic',
        `Internal error occurred: ${exception.message}`,
        'Internal error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Logs will contain an error identifier as well as
    // request path where it has occurred

    this.logger.error(
      `Got an exception: ${JSON.stringify({
        path: request.url,
        ...body,
      })}`,
    );

    response.status(status).json(body);
  }
}
