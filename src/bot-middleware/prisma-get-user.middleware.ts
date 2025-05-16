import { FolderType } from '@prisma/client';
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
          folders: {
            create: [
              { title: '📂 Без категории', type: FolderType.DEFAULT },
              { title: '🗑️ Корзина', type: FolderType.TRASH },
            ],
          },
        },
      });
    }

    ctx.session.user = user;
  }
  await next();
}
