import { Catch, ExceptionFilter, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { AuthenticationLogService } from 'src/authenticationlog/authenticationlog.service';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private readonly authenticationLogService: AuthenticationLogService) {}

  async catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception.getStatus();
    const message = exception.message;

    // Log the exception to the database
    await this.authenticationLogService.create({
      user_id: request['user']?.userid || 'unknown',
      event: message,
      status: 'Failure',
    });

    // Return the response
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
