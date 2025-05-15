import { Menu } from '@grammyjs/menu';

import { CustomContext } from '../types/custom-context.interface';

import { backToMenu } from './main.menu';

export const notifyMenu = new Menu<CustomContext>('notify-menu')
  .text('⬅️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .text('➡️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .row()
  .text('🔙 Назад', async (ctx: CustomContext) => await backToMenu(ctx));

export const notifyMenuText =
  '📋 Меню напоминаний. Вы можете: \n\n1️⃣ Просматривать заметки.\n' +
  '2️⃣ Управлять папками и группами заметок.\n' +
  '3️⃣ Редактировать напоминания.\n\n' +
  '📌 Просто выберите интересующую опцию на клавиатуре.';
