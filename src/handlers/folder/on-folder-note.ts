import { InlineKeyboard } from 'grammy';

import { botState } from '../../types/bot-state';
import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

import { getAllFoldersInline } from './get-all-folders.inline';

export async function onFolderNote(ctx: CustomContext) {
  ctx.session.currentNoteId = Number(ctx.match[1]);
  ctx.session.currentMenuId = ctx.callbackQuery.message.message_id;

  const folderButtons = await getAllFoldersInline(ctx, callbackEnum.ADD_NOTE_TO_FOLDER_);
  if (!folderButtons) return await ctx.answerCallbackQuery(`ℹ️ У вас не создана ни одна папка.`);

  const kb = new InlineKeyboard();
  kb.text('🔙 Отмена', callbackEnum.CANCEL_FOLDER_NOTE);
  folderButtons.forEach((button) => {
    kb.row().add(button);
  });

  return await ctx.editMessageText(`📌 Выберите папку в которую будет добавлена заметка`, {
    reply_markup: kb,
  });
}

export async function onAddToFolder(ctx: CustomContext) {
  const noteMessageId = ctx.session.currentNoteId.toString();
  const folderId = Number(ctx.match[1]);

  const note = await prisma.note.update({
    where: { messageId: noteMessageId },
    data: { folder: { connect: { id: folderId } } },
  });
  if (note) await ctx.answerCallbackQuery('Заметка успешно добавлена в папку!');
  else await ctx.answerCallbackQuery('Не удалось добавить заметку в папку!');
  return onCancelFolderNote(ctx);
}

export async function onCancelFolderNote(ctx: CustomContext) {
  ctx.session.state = botState.idle;
  await returnNoteMenu(ctx, ctx.session.currentNoteId, ctx.session.currentMenuId);
  ctx.session.currentNoteId = undefined;
  ctx.session.currentMenuId = undefined;
}
