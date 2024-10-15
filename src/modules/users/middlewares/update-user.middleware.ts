import { Prisma } from '@prisma/client';
import { generateHash } from '@common/utils';

export const updateUserMiddleware = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      user: {
        async update({ args, query }) {
          if (args.data.password && typeof args.data.password === 'string') {
            args.data.password = await generateHash(args.data.password);
          }
          return query(args);
        },
      },
    },
  });
});
