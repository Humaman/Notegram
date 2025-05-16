import { CustomContext } from '../types/custom-context.interface';

import { onReset } from './reset.command';

export async function onStart(ctx: CustomContext) {
  await onReset(ctx);
  await ctx.reply(
    '👋 Привет! Я бот для заметок и напоминаний.\n\n' +
      '✨ Вот что я умею:\n\n' +
      '1️⃣ Сохранять текст, фото, видео, аудио и документы.\n' +
      '2️⃣ Отправлять напоминания по сохранённым заметкам.\n' +
      '3️⃣ Управлять вашими заметками через удобные команды.\n\n' +
      '💬 Просто отправьте сообщение, чтобы создать из него заметку! \n' +
      '📋 Используйте команду /menu чтобы получить меню бота',
  );
}
