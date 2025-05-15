import { InlineKeyboard } from 'grammy';

import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';
import { getAllFoldersInline } from '../new-folder/get-all-folders.inline';

export async function onFolderNote(ctx: CustomContext) {
  const noteMessageId = ctx.match[1];

  const callback = `${callbackEnum.ADD_NOTE_TO_FOLDER_}${noteMessageId}`;

  const folderButtons = await getAllFoldersInline(ctx, callback);
  if (!folderButtons) return ctx.answerCallbackQuery(`ℹ️ У вас не создана ни одна папка.`);

  const kb = new InlineKeyboard();
  kb.add({
    text: '🔙 Отмена',
    callback_data: `${callbackEnum.CANCEL_FOLDER_NOTE_}${noteMessageId}`,
  });
  folderButtons.forEach((button) => {
    kb.row().add(button);
  });

  return ctx.editMessageText(`📌 Выберите папку в которую будет добавлена заметка`, {
    reply_markup: kb,
  });
}
