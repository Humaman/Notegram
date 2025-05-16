import { CustomContext } from '../../types/custom-context.interface';

import { noteReplyText } from './note-handler';
import { getNoteKb } from './note.inline';

export async function returnNoteMenu(ctx: CustomContext, noteMsgId: number, menuMessageId: number) {
  const note = await prisma.note.findUnique({ where: { messageId: noteMsgId.toString() } });
  if (!note) {
    return await ctx.api.editMessageText(ctx.chat.id, Number(menuMessageId), 'Заметка удалена');
  }
  const kb = getNoteKb(noteMsgId.toString());
  try {
    await ctx.api.editMessageText(ctx.chat.id, Number(menuMessageId), noteReplyText, {
      reply_markup: kb,
    });
  } catch (e) {
    console.error('Ошибка при изменении ответа на заметку', e);
    await ctx.reply('Произошла ошибка в меню заметки. Возможно вы удалили сообщение...');
  }
}
