import * as crypto from 'crypto';

import { FolderType, User } from '@prisma/client';
export async function createUser(tgId: string): Promise<User> {
  const yandexPassword = fixedLengthString(tgId);

  const newUser = await prisma.user.create({
    data: {
      yandex_id: 'not_authed_' + tgId,
      yandex_password: yandexPassword,
      tg_id: tgId,
      folders: {
        create: [
          { title: '📂 Без категории', type: FolderType.DEFAULT },
          { title: '🗑️ Корзина', type: FolderType.TRASH },
        ],
      },
    },
  });
  return newUser;
}

export function fixedLengthString(telegramId: string): string {
  const hash = crypto.createHash('sha256').update(telegramId).digest('hex');
  return hash.substring(0, 16);
}
