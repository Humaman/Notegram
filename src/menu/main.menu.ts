import { Menu } from '@grammyjs/menu';

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
  );

async function openMenu(ctx: CustomContext, subMenuName: string, subMenuText: string) {
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, subMenuText);
  return ctx.menu.nav(subMenuName);
}

export async function backToMenu(ctx: CustomContext) {
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, mainMenuText);
  return ctx.menu.back();
}

export const mainMenuText =
  '📋 Главное меню бота. Вы можете: \n\n1️⃣ Просматривать заметки.\n' +
  '2️⃣ Управлять папками и группами заметок.\n' +
  '3️⃣ Редактировать напоминания.\n\n' +
  '📌 Просто выберите интересующую опцию на клавиатуре.';
