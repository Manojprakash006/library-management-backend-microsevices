import { Catch, ArgumentsHost, HttpException, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const error = typeof errorResponse === 'object' ? errorResponse : { message: errorResponse };
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: error['message'] || 'Internal server error',
      error: error['error'] || null,
    };

    this.logger.error(`${request.method} ${request.url} ${status} - ${JSON.stringify(responseBody)}`);
    response.status(status).json(responseBody);
  }
}
