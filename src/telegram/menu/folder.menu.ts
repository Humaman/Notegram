import { Menu } from '@grammyjs/menu';

import { CustomContext } from '../types/custom-context.interface';

import { backToMenu } from './main.menu';

export const folderMenu = new Menu<CustomContext>('folder-menu')
  .text('⬅️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .text('➡️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .row()
  .text('🔙 Назад', async (ctx: CustomContext) => await backToMenu(ctx));

export const folderMenuText =
  '📋 Ваши папки! Здесь вы можете:\n\n 1️⃣ Cоздавать папки.\n 2️⃣ Переименовывать папки.\n 3️⃣ Удалять папки. \n\n' +
  '📌 Просто выберите интересующую опцию на клавиатуре.';
