import { NextFunction } from 'grammy';

import { createUser } from '../../common/create-user';
import prisma from '../../common/prisma';
import { CustomContext } from '../types/custom-context.interface';

export async function PrismaGetUserMiddleware(
  ctx: CustomContext,
  next: NextFunction,
): Promise<void> {
  if (!ctx?.session?.user) {
    const tgId = String(ctx.chatId);
    let user = await prisma.user.findUnique({ where: { tg_id: tgId } });

    if (!user) user = await createUser(tgId);
    ctx.session.user = user;
  }
  await next();
}
