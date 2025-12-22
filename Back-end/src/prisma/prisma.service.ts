import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
// NodeNext/ESM resolvers may require explicit index.js path for Prisma
import { PrismaClient } from '@prisma/client/index.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
