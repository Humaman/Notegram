import { CustomContext } from '../../types/custom-context.interface';

import { getNoteKb } from './note.inline';

export async function returnNoteMenu(ctx: CustomContext, noteMsgId: string) {
  const note = await prisma.note.findUnique({ where: { messageId: noteMsgId } });
  if (!note) {
    return ctx.editMessageText('Заметка удалена');
  }
  const kb = getNoteKb(noteMsgId);
  try {
    await ctx.editMessageText('Сообщение добавлено в заметки!', {
      reply_markup: kb,
    });
  } catch (e) {
    console.error('Ошибка при изменении ответа на заметку', e);
    await ctx.reply('Произошла ошибка в меню заметки. Возможно вы удалили сообщение...');
  }
}
