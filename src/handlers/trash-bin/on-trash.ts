import { FolderType } from '@prisma/client';
import { InlineKeyboard } from 'grammy';

import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

export async function onTrashNote(ctx: CustomContext) {
  const noteMsgId = ctx.match[1];
  const trashFolder = await prisma.folder.findFirst({
    where: { userId: ctx.session.user.id, type: FolderType.TRASH },
  });
  await prisma.note.update({
    where: { messageId: noteMsgId },
    data: { folder: { connect: { id: trashFolder.id } } },
  });

  const menuMsgId = ctx.callbackQuery.message.message_id;

  const kb = new InlineKeyboard().add({
    text: '⬅️ Вернуть из корзины',
    callback_data: `${callbackEnum.CANCEL_TRASH_NOTE_}${noteMsgId}`,
  });

  await ctx.api.editMessageText(ctx.chat.id, menuMsgId, 'Заметка в корзине', {
    reply_markup: kb,
  });
}

export async function onCancelTrashNote(ctx: CustomContext) {
  const noteMsgId = ctx.match[1];
  const deafultFolder = await prisma.folder.findFirst({
    where: { userId: ctx.session.user.id, type: FolderType.DEFAULT },
  });
  await prisma.note.update({
    where: { messageId: noteMsgId },
    data: { folder: { connect: { id: deafultFolder.id } } },
  });

  await returnNoteMenu(ctx, noteMsgId);
}
