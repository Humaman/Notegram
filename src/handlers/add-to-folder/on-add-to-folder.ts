import { CustomContext } from '../../types/custom-context.interface';

import { onCancelFolderNote } from './on-cancel-folder-note';

export async function onAddToFolder(ctx: CustomContext) {
  const noteMessageId = ctx.match[1];
  const folderId = Number(ctx.match[2]);

  const note = await prisma.note.update({
    where: { messageId: noteMessageId },
    data: {
      folder: { connect: { id: folderId } },
    },
  });
  if (note) await ctx.answerCallbackQuery('Заметка успешно добавлена в папку!');
  else await ctx.answerCallbackQuery('Не удалось добавить заметку в папку!');
  return onCancelFolderNote(ctx);
}
