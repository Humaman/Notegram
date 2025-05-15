import { Menu, MenuRange } from '@grammyjs/menu';

import { botState } from '../types/bot-state';
import { CustomContext } from '../types/custom-context.interface';

import { mainMenuText } from './main.menu';
import { tryOpenNote } from './note-viewer.menu';

export const noteMenu = new Menu<CustomContext>('note-menu')
  .text('🔍 Выполнить поиск', async (ctx: CustomContext) => {
    if (await tryOpenNote(ctx)) return ctx.menu.nav('note-viewer-menu');
    else return ctx.reply('По этому запросу нет заметок.');
  })
  .row()
  .text('📝 Веести текст', async (ctx: CustomContext) => {
    ctx.session.state = botState.noteSearch;
    await ctx.reply('Отправьте текст, который будет использоваться при поиске заметки');
  })
  .row()
  .text('🔙 Назад', async (ctx: CustomContext) => await noteBackToMenu(ctx))
  .row()
  .text('🗂️ Все папки', async (ctx: CustomContext) => {
    ctx.session.noteQuery.folder = undefined;
    await ctx.reply('Вы выбрали все папки');
  })
  .row()
  .dynamic(async (ctx: CustomContext) => await getFolders(ctx));

export async function onNoteSearchText(ctx: CustomContext) {
  ctx.session.state = botState.idle;
  ctx.session.noteQuery.text = ctx.msg.text;
  await ctx.api.setMessageReaction(ctx.chat.id, ctx.msg.message_id, [
    { type: 'emoji', emoji: '👍' },
  ]);
}

export async function onNoNoteSearchText(ctx: CustomContext) {
  ctx.session.noteQuery.text = undefined;
  await ctx.api.setMessageReaction(ctx.chat.id, ctx.msg.message_id, [
    { type: 'emoji', emoji: '👎' },
  ]);
  await ctx.reply('Отправь текст для поиска');
}

async function getFolders(ctx: CustomContext) {
  const range = new MenuRange<CustomContext>();
  const folders = await prisma.folder.findMany({
    where: { userId: ctx.session.user.id },
    orderBy: [{ type: 'asc' }, { title: 'asc' }],
  });
  folders.forEach((folder) => {
    range
      .text(folder.title, async (ctx: CustomContext) => {
        ctx.session.noteQuery.folder = folder.id;
        await ctx.reply(`Вы выбрали папку: ${folder.title}`);
      })
      .row();
  });
  return range;
}

export const noteMenuText =
  '📋 Меню заметок.\n\n' +
  'Укажие текст для поиска и папку \n(По-умолчанию откроется последняя заметка)\n\n' +
  '📌 Выберите интересующую папку на клавиатуре:';

export async function noteBackToMenu(ctx: CustomContext) {
  ctx.session.noteQuery.folder = undefined;
  ctx.session.noteQuery.text = undefined;
  ctx.session.noteQuery.index = 0;
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id, mainMenuText);
  return ctx.menu.back();
}
