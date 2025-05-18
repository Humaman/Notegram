import { botState } from '../../types/bot-state';
import { CustomContext } from '../../types/custom-context.interface';
import { NoteCreateInput } from '../../types/note-create.interface';
import { sendNoteMessage } from '../note/note-handler';

export async function onEditedNote(ctx: CustomContext, noteData: NoteCreateInput) {
  const noteId = ctx.session.currentNoteId;

  const prismaCall = await tryEditNote(noteId, noteData);

  if (prismaCall) {
    const messageId = String(ctx.msg.message_id);
    await ctx.api.deleteMessage(ctx.chat.id, Number(noteId));
    await sendNoteMessage(ctx, messageId);
  } else {
    await ctx.reply(
      '⚠️ Произошла ошибка при редактировании заметки. Пожалуйста, попробуйте еще раз позже.',
    );
  }
  ctx.session.currentNoteId = undefined;
  ctx.session.state = botState.idle;
}

export async function tryEditNote(noteId: number, noteData: NoteCreateInput) {
  try {
    await prisma.note.update({
      where: { messageId: noteId },
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
