import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const queryTimeMiddleware = Prisma.defineExtension((client) => {
  const logger = new Logger('Prisma');
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          logger.debug(`${model}.${operation} took ${time}ms`);
          return result;
        },
      },
    },
  });
});
