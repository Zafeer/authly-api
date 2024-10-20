import { redactSensitiveFields } from '@helpers/utils';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: NextFunction) {
    const existingID =
      req.id ?? req.headers['x-request-id'] ?? req.headers['x-correlation-id'];
    if (!existingID) res.setHeader('X-Request-Id', uuidv4());
    this.logger.log(
      {
        url: req.url,
        method: req.method,
        body: redactSensitiveFields(req.body, ['password', 'otpToken']),
        query: req.query,
        params: req.params,
        statusCode: res.statusCode,
        headers: redactSensitiveFields(req.headers, ['authorization']),
        remotePort: req.socket.remotePort,
        remoteIp: req.socket.remoteAddress,
        resHeaders: res.getHeaders(),
      },

      //   `Logging HTTP request ${req.method} ${req.url} ${res.statusCode}`,
    );
    next();
  }
}
