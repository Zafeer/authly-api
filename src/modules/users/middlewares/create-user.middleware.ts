import { Prisma } from '@prisma/client';
import { generateHash } from '@helpers/utils';

export const createUserMiddleware = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      user: {
        async create({ args, query }) {
          if (args.data.password) {
            args.data.password = await generateHash(args.data.password);
          }
          return query(args);
        },
      },
    },
  });
});
