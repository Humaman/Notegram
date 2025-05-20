import * as crypto from 'crypto';

import { FolderType, User } from '@prisma/client';
export async function createUser(tgId: string): Promise<User> {
  const newUser = await prisma.user.create({
    data: {
      yandex_password: generateOneTimePassword(tgId),
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

export function generateOneTimePassword(telegramId: string): string {
  const randomPart = crypto.randomBytes(4).toString('hex'); // 8 символов
  const base = `${telegramId}-${Date.now()}-${randomPart}`;
  const hash = crypto.createHash('sha256').update(base).digest('hex');
  return hash.substring(0, 10); // Одноразовый пароль длиной 10 символов
}
