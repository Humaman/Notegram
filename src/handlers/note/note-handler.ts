import { FolderType } from '@prisma/client';

import { CustomContext } from '../../types/custom-context.interface';
import { NoteCreateInput } from '../../types/note-create.interface';

import { getNoteKb } from './note.inline';

export async function noteHandler(ctx: CustomContext, noteData: NoteCreateInput) {
  console.debug('БОТ получил сообщение от пользователя', ctx.msg.from.id);
  const prismaCall = await tryAddNote(ctx, noteData);

  if (prismaCall) {
    const messageId = String(ctx.msg.message_id);
    return sendNoteMessage(ctx, messageId);
  } else {
    return ctx.reply(
      '⚠️ Произошла ошибка при добавлении заметки. Пожалуйста, попробуйте еще раз позже.',
    );
  }
}

export async function sendNoteMessage(ctx: CustomContext, messageId: string) {
  const kb = getNoteKb(messageId);
  try {
    await ctx.reply('Сообщение добавлено в заметки!', {
      reply_markup: kb,
      reply_parameters: { message_id: Number(messageId) },
    });
  } catch (e) {
    console.error('Ошибка при отправке ответа на заметку', e);
    await ctx.reply(
      'Произошла ошибка при отправке ответа на заметку. Возможно вы удалили сообщение с ней...',
    );
  }
}

export async function tryAddNote(ctx: CustomContext, noteData: NoteCreateInput) {
  try {
    await prisma.note.create({
      data: {
        user: { connect: { id: ctx.session.user.id } },
        folder: { connect: { id: folder.id } },
        ...noteData,
      },
    });
    return true;
  } catch (e) {
    console.error('\x1b[31mError while adding message:\x1b[0m', e);
    return false;
  }
}
