import { Prisma } from '@prisma/client';
import { generateHash } from '@helpers/utils';

export const userMiddleware = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      user: {
        async create({ args, query }) {
          if (args.data.password) {
            args.data.password = await generateHash(args.data.password);
          }
          if (
            args.data.otpTokenHash &&
            typeof args.data.otpTokenHash === 'string'
          ) {
            args.data.otpTokenHash = await generateHash(args.data.otpTokenHash);
          }
          return query(args);
        },
        async update({ args, query }) {
          if (args.data.password && typeof args.data.password === 'string') {
            args.data.password = await generateHash(args.data.password);
          }
          if (
            args.data.otpTokenHash &&
            typeof args.data.otpTokenHash === 'string'
          ) {
            args.data.otpTokenHash = await generateHash(args.data.otpTokenHash);
          }
          return query(args);
        },
      },
    },
  });
});
