import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from '@constants/http-errors-codes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = exception?.response?.message || INTERNAL_SERVER_ERROR;

    const [code, message] = errorMessage?.split(':');

    if (!message) {
      const [serverErrorCode] = INTERNAL_SERVER_ERROR.split(':');

      const exceptionResponse = {
        success: false,
        message: errorMessage?.trim() || INTERNAL_SERVER_ERROR,
        data: {
          code: parseInt(serverErrorCode, 10),
          details: exception?.response?.error,
        },
      };

      Logger.error(exception, 'AllExceptionsFilter');
      Logger.error(exception.stack, 'AllExceptionsFilter');

      return res.status(status).json(exceptionResponse);
    }

    const exceptionResponse = {
      success: false,
      message: message?.trim(),
      data: {
        code: parseInt(code, 10),
        details: exception?.response?.error,
      },
    };

    Logger.error(exception, 'AllExceptionsFilter');
    Logger.error(exception.stack, 'AllExceptionsFilter');

    return res.status(status).json(exceptionResponse);
  }
}
