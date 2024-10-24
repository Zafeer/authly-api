import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { VALIDATION_ERROR } from '@constants/http-errors-codes';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const [code, message] = VALIDATION_ERROR.split(':');

    return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: message.trim(),
      data: {
        code: parseInt(code, 10),
        details: exception.validationErrors,
      },
    });
  }
}
