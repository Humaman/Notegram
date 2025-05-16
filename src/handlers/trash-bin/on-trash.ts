import { FolderType } from '@prisma/client';
import { InlineKeyboard } from 'grammy';

import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

export async function onTrashNote(ctx: CustomContext) {
  ctx.session.currentNoteId = Number(ctx.match[1]);
  ctx.session.currentMenuId = ctx.callbackQuery.message.message_id;

  const trashFolder = await prisma.folder.findFirst({
    where: { userId: ctx.session.user.id, type: FolderType.TRASH },
  });
  await prisma.note.update({
    where: { messageId: ctx.session.currentNoteId.toString() },
    data: { folder: { connect: { id: trashFolder.id } } },
  });

  await ctx.api.editMessageText(ctx.chat.id, ctx.session.currentMenuId, 'Заметка в корзине', {
    reply_markup: new InlineKeyboard().text(
      '⬅️ Вернуть из корзины',
      callbackEnum.CANCEL_TRASH_NOTE,
    ),
  });
}

export async function onCancelTrashNote(ctx: CustomContext) {
  const deafultFolder = await prisma.folder.findFirst({
    where: { userId: ctx.session.user.id, type: FolderType.DEFAULT },
  });
  await prisma.note.update({
    where: { messageId: ctx.session.currentNoteId.toString() },
    data: { folder: { connect: { id: deafultFolder.id } } },
  });

  await returnNoteMenu(ctx, ctx.session.currentNoteId, ctx.session.currentMenuId);
  ctx.session.currentNoteId = undefined;
  ctx.session.currentMenuId = undefined;
}
