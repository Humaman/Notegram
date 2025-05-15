import { botState } from '../../types/bot-state';
import { CustomContext } from '../../types/custom-context.interface';
import { NoteCreateInput } from '../../types/note-create.interface';
import { getNoteKb } from '../note/note.inline';

export async function onEditedNote(ctx: CustomContext, noteData: NoteCreateInput) {
  const noteMsgId = ctx.session.editNoteId;

  const prismaCall = await tryEditNote(ctx, noteMsgId, noteData);

  if (prismaCall) {
    const messageId = String(ctx.msg.message_id);
    await ctx.api.deleteMessage(ctx.chat.id, Number(noteMsgId));
    await sendNoteMessage(ctx, messageId);
  } else {
    await ctx.reply(
      '⚠️ Произошла ошибка при редактировании заметки. Пожалуйста, попробуйте еще раз позже.',
    );
  }
  ctx.session.editNoteId = undefined;
  ctx.session.state = botState.idle;
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

export async function tryEditNote(
  ctx: CustomContext,
  noteMsgId: string,
  noteData: NoteCreateInput,
) {
  try {
    await prisma.note.update({
      where: { messageId: noteMsgId },
      data: {
        ...noteData,
      },
    });
    return true;
  } catch (e) {
    console.error('\x1b[31mError while editing message:\x1b[0m', e);
    return false;
  }
}
