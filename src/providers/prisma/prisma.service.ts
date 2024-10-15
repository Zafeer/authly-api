import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { createUserMiddleware } from '@modules/users/middlewares/create-user.middleware';
import { queryTimeMiddleware } from '@providers/prisma/middlewares/query-time.middleware';
import { updateUserMiddleware } from '@modules/users/middlewares/update-user.middleware';

function extendPrismaClient() {
  const prisma = new PrismaClient();
  return prisma
    .$extends({
      client: {
        async onModuleInit() {
          // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#connect
          await Prisma.getExtensionContext(this).$connect();
        },
        async enableShutdownHooks(app: INestApplication) {
          Prisma.getExtensionContext(this).$on('beforeExit', async () => {
            await app.close();
          });
        },
      },
    })
    .$extends(queryTimeMiddleware)
    .$extends(createUserMiddleware)
    .$extends(updateUserMiddleware);
}

const ExtendedPrismaClient = class {
  constructor() {
    return extendPrismaClient();
  }
} as new () => ReturnType<typeof extendPrismaClient>;

@Injectable()
export class PrismaService
  extends ExtendedPrismaClient
  implements OnModuleInit {}
