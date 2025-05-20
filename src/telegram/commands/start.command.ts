import { getYandexPassword } from '../common/yandex-pass';
import { CustomContext } from '../types/custom-context.interface';

import { onReset } from './reset.command';

export async function onStart(ctx: CustomContext) {
  await onReset(ctx);
  const payload = ctx?.match;

  if (payload === 'get_password') {
    await ctx.reply(
      `🔐 *Ваш одноразовый пароль для входа*\n\n` +
        `📥 Скопируйте его и введите на сайте авторизации, чтобы войти в аккаунт\\.\n\n` +
        `⚠️ Он действителен только один раз\\.`,
      { parse_mode: 'MarkdownV2' },
    );
    const pass = await getYandexPassword(ctx.message.from.id.toString());

    return await ctx.reply(`||${pass}||`, { parse_mode: 'MarkdownV2' });
  }

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
