import { Menu } from '@grammyjs/menu';

import { CustomContext } from '../types/custom-context.interface';

export async function onNewMenu(ctx: CustomContext, text: string, menu: Menu<CustomContext>) {
  await ctx.deleteMessage();
  const menuMgs = await ctx.reply(text, { reply_markup: menu });
  if (!ctx.session.menuId) {
    ctx.session.menuId = menuMgs.message_id.toString();
    return;
  }

  try {
    await ctx.api.deleteMessage(ctx.chat.id, Number(ctx.session.menuId));
  } catch {
    console.error('Не удалось удалить старое меню, вероятно, сообщение уже удалено');
  } finally {
    ctx.session.menuId = menuMgs.message_id.toString();
  }
}

export async function onEditMenu(ctx: CustomContext, text: string, menu: Menu<CustomContext>) {
  await ctx.api.editMessageText(ctx.chat.id, Number(ctx.session.menuId), text, {
    reply_markup: menu,
  });
}
