import { Menu } from '@grammyjs/menu';
import { Note } from '@prisma/client';
import dayjs from 'dayjs';

import { CustomContext, NoteQuery } from '../types/custom-context.interface';

import { noteMenu, noteMenuText } from './note.menu';

export const noteViewerMenu = new Menu<CustomContext>('note-viewer-menu')
  .text('⬅️', async (ctx: CustomContext) => await prevNote(ctx))
  .text('➡️', async (ctx: CustomContext) => await nextNote(ctx))
  .row()
  .text('🔙 Назад', async (ctx: CustomContext) => await noteBackToMenu(ctx));

async function nextNote(ctx: CustomContext) {
  ctx.session.noteQuery.index = ctx.session.noteQuery.index + 1;
  const isNote = await tryOpenNote(ctx);
  if (!isNote) {
    await ctx.answerCallbackQuery('По этому запросу больше нет заметок');
    ctx.session.noteQuery.index = ctx.session.noteQuery.index - 1;
  }
}

async function prevNote(ctx: CustomContext) {
  ctx.session.noteQuery.index = ctx.session.noteQuery.index - 1;
  const isNote = await tryOpenNote(ctx);
  if (!isNote) {
    await ctx.answerCallbackQuery('По этому запросу больше нет заметок');
    ctx.session.noteQuery.index = ctx.session.noteQuery.index + 1;
  }
}

export async function tryOpenNote(ctx: CustomContext) {
  const menuId = ctx.callbackQuery.message.message_id.toString();
  const note = await getNote(ctx);
  if (!note) {
    return false;
  }

  //Если мы вызовем drawNote от той же заметки, то Telegram уронит сервер
  if (note.id === ctx.session?.previousNoteId) {
    return false;
  }

  await drawNote(ctx, menuId, note);
  return true;
}

export async function getNote(ctx: CustomContext) {
  const noteQuery: NoteQuery = ctx.session.noteQuery;

  let dir;
  if (noteQuery.index < 0) dir = 'asc';
  else dir = 'desc';

  const index = Math.abs(noteQuery.index);

  const filters: any = { userId: ctx.session.user.id };

  if (noteQuery.folder) filters.folder = { id: noteQuery.folder };

  if (noteQuery.text) {
    filters.OR = [
      { text: { contains: noteQuery.text, mode: 'insensitive' } },
      { caption: { contains: noteQuery.text, mode: 'insensitive' } },
    ];
  }

  const note = await prisma.note.findFirst({
    where: filters,
    skip: index,
    take: 1,
    orderBy: { created_at: dir },
  });

  return note ?? null;
}

export async function drawNote(ctx: CustomContext, menuId: string, note: Note | null) {
  ctx.session.previousNoteId = note.id;
  const messageId = Number(menuId);
  await ctx.api.deleteMessage(ctx.chat.id, messageId);

  if (note.text) {
    const text = noteTextWrap(note.text, note);
    return ctx.reply(text, { reply_markup: noteViewerMenu });
  }

  if (note.caption) {
    const caption = noteTextWrap(note.caption, note);

    if (note.image) {
      return ctx.replyWithPhoto(note.image, { caption, reply_markup: noteViewerMenu });
    }
    if (note.video) {
      return ctx.replyWithVideo(note.video, { caption, reply_markup: noteViewerMenu });
    }
    if (note.audio) {
      return ctx.replyWithAudio(note.audio, { caption, reply_markup: noteViewerMenu });
    }
    if (note.doc) {
      return ctx.replyWithDocument(note.doc, { caption, reply_markup: noteViewerMenu });
    }
  }
}

function noteTextWrap(text: string, note: Note) {
  const dateFormat = 'HH:mm DD-MM-YYYY';

  // Форматируем даты с помощью dayjs
  const formatedCreatedAt = dayjs(note.created_at).format(dateFormat);
  const formatedUpdatedAt = dayjs(note.updated_at).format(dateFormat);

  const wrapedText =
    `Заметка #${note.id}\n\n` +
    text +
    `\n\n🌱 Создана ${formatedCreatedAt}\n✏️ Обновлена: ${formatedUpdatedAt}`;
  return wrapedText;
}

export async function noteBackToMenu(ctx: CustomContext) {
  ctx.session.noteQuery.folder = undefined;
  ctx.session.noteQuery.text = undefined;
  ctx.session.noteQuery.index = 0;
  ctx.session.previousNoteId = undefined;
  await ctx.api.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id);
  return ctx.reply(noteMenuText, { reply_markup: noteMenu });
}
