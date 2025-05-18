import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line unusedImports/no-unused-vars
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], //'query',
  });

global.prisma = prisma;

export default prisma;
