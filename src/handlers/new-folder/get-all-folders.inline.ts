import { InlineKeyboardButton } from 'grammy/types';

import { CustomContext } from '../../types/custom-context.interface';

export async function getAllFoldersInline(
  ctx: CustomContext,
  callback: string,
): Promise<InlineKeyboardButton[] | null> {
  const user = await prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    include: { folders: true },
  });
  if (!user || !user.folders || user.folders.length <= 0) {
    return null;
  }
  const folders = user.folders;

  const buttons: InlineKeyboardButton[] = [];

  folders.forEach((folder) => {
    buttons.push({
      text: folder.title,
      callback_data: callback + '_' + folder.id.toString(),
    });
  });

  return buttons;
}
