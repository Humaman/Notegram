import { Menu } from '@grammyjs/menu';

import { getYandexPassword } from '../common/yandex-pass';
import { CustomContext } from '../types/custom-context.interface';

import { folderMenuText } from './folder.menu';
import { noteMenuText } from './note.menu';
import { notifyMenuText } from './notify.menu';

export const mainMenu = new Menu<CustomContext>('bot-menu')
  .text('📋 Мои заметки', async (ctx: CustomContext) => openMenu(ctx, 'note-menu', noteMenuText))
  .row()
  .text('📁 Управление папками', async (ctx: CustomContext) =>
    openMenu(ctx, 'folder-menu', folderMenuText),
  )
  .row()
  .text('⏰ Напоминания', async (ctx: CustomContext) =>
    openMenu(ctx, 'notify-menu', notifyMenuText),
  )
  .row()
  .text('📨 Пароль для yandex', async (ctx: CustomContext) => {
    await ctx.reply(`🤐 Ваш одноразовый пароль для входа:`);
    const pass = await getYandexPassword(ctx.callbackQuery.from.id.toString());
    return await ctx.reply(`||${pass}||`, { parse_mode: 'MarkdownV2' });
  });

async function openMenu(ctx: CustomContext, subMenuName: string, subMenuText: string) {
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, subMenuText);
  return ctx.menu.nav(subMenuName);
}

export async function backToMenu(ctx: CustomContext) {
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, mainMenuText);
  ctx.session.noteQuery.folder = undefined;
  ctx.session.noteQuery.text = undefined;
  ctx.session.noteQuery.index = 0;
  return ctx.menu.back();
}

export const mainMenuText =
  '📋 Главное меню бота. Вы можете: \n\n1️⃣ Просматривать заметки.\n' +
  '2️⃣ Управлять папками и группами заметок.\n' +
  '3️⃣ Редактировать напоминания.\n\n' +
  '📌 Просто выберите интересующую опцию на клавиатуре.';
