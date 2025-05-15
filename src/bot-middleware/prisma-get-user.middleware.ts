import { NextFunction } from 'grammy';

import prisma from '../common/prisma';
import { CustomContext } from '../types/custom-context.interface';

export async function PrismaGetUserMiddleware(
  ctx: CustomContext,
  next: NextFunction, // is an alias for: () => Promise<void>
): Promise<void> {
  if (!ctx.session.user) {
    const tgId = String(ctx.chatId);
    if (!tgId) {
      console.error('\x1b[31mTelegram ID is missing in the message context\x1b[0m');
      return;
    }

    let user = await prisma.user.findUnique({
      where: { tg_id: tgId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          tg_id: tgId,
          username: ctx.msg.from.username ? ctx.msg.from.username : undefined,
          first_name: ctx.msg.from.first_name ? ctx.msg.from.first_name : undefined,
          last_name: ctx.msg.from.last_name ? ctx.msg.from.last_name : undefined,
        },
      });
    }

    ctx.session.user = user;
  }
  await next();
}
