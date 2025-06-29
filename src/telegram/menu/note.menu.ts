import { Menu, MenuRange } from '@grammyjs/menu';

import { botState } from '../types/bot-state';
import { CustomContext } from '../types/custom-context.interface';

import { backToMenu } from './main.menu';
import { tryOpenNote } from './note-viewer.menu';

export const noteMenu = new Menu<CustomContext>('note-menu')
  .text('🔍 Выполнить поиск', async (ctx: CustomContext) => {
    const isNotes = await tryOpenNote(ctx);
    if (!isNotes) return await ctx.reply('По этому запросу нет заметок.');
  })
  .row()
  .text('📝 Веести текст', async (ctx: CustomContext) => {
    ctx.session.state = botState.noteSearch;
    await ctx.reply(
      'Отправьте текст, для поиска, затем нажмите\n🔍 Выполнить поиск\n\nИли отправьте /cancel для отмены ввода текста',
    );
  })
  .row()
  .text('🔙 Назад', async (ctx: CustomContext) => await backToMenu(ctx))
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

export async function onCancelNoteSearchText(ctx: CustomContext) {
  ctx.session.noteQuery.text = undefined;
  ctx.session.state = botState.idle;
  await ctx.api.setMessageReaction(ctx.chat.id, ctx.msg.message_id, [
    { type: 'emoji', emoji: '👌' },
  ]);
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
  'Укажие текст для поиска и папку \n(По умолчанию откроется последняя заметка)\n\n' +
  '📌 Выберите интересующую папку на клавиатуре:';
