import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { transports, format } from 'winston';
import 'winston-daily-rotate-file';

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // Log errors into its own file
    new transports.DailyRotateFile({
      // %DATE will be replaced by the current date
      filename: `logs/%DATE%-error.log`,
      level: 'error',
      format: format.combine(format.ms(), format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // don't want to zip our logs
      maxFiles: '30d', // will keep log until they are older than 30 days
    }),
    // Log all levels
    // same for all levels
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),
    // Log to console
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Authly', {
          colors: true,
          prettyPrint: true,
        }),
        format.printf((info) => {
          const pid = process.pid;
          const timestamp = info.timestamp;
          const level = info.level.toUpperCase();
          const context = info.context || 'Application';
          const message = info.message;
          return `[Nest] ${pid} - ${timestamp} ${level} [${context}] ${message}`;
        }),
      ),
    }),
  ],
});
