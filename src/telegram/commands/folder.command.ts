import { InlineKeyboard } from 'grammy';

import { getAllFoldersInline } from '../handlers/folder/get-all-folders.inline';
import { botState } from '../types/bot-state';
import { callbackEnum } from '../types/callback.enum';
import { CustomContext } from '../types/custom-context.interface';

export async function onFolder(ctx: CustomContext) {
  ctx.session.state = botState.folder;

  const kb = new InlineKeyboard();
  const folderButtons = await getAllFoldersInline(ctx, callbackEnum.FOLDER_MENU_);
  folderButtons.forEach((button) => {
    kb.add(button).row();
  });

  await ctx.reply(
    '📌 Это меню папок. Оно позволяет: \n\n 1. Cоздать новую папку для группировки сообщений.' +
      '2.Переименовать папку.\n' +
      '3.Удалить папку (сообщения отправятся в неотсортированные).\n' +
      'Вот список всех ваших папок отправьте сообщение с названием вашей папки или используйте /reset для отмены операции.',
  );
}

export async function onNewFolder(ctx: CustomContext) {
  ctx.session.state = botState.newFolder;
  await ctx.reply(
    '📌 Команда /folder создать новую папку для группировки сообщений.\n\n' +
      'Просто отправьте сообщение с названием вашей папки или используйте /reset для отмены операции.',
  );
}
