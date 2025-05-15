import { Menu } from '@grammyjs/menu';

import { CustomContext } from '../types/custom-context.interface';

export async function onNewMenu(ctx: CustomContext, text: string, menu: Menu<CustomContext>) {
  await ctx.deleteMessage();
  return ctx.reply(text, { reply_markup: menu });
}
