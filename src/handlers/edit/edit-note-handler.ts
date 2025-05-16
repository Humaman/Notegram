import { InlineKeyboard } from 'grammy';

import { botState } from '../../types/bot-state';
import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

export async function noteEditHandler(ctx: CustomContext) {
  const noteMsgId = Number(ctx.match[1]);

  ctx.session.state = botState.editNote;
  ctx.session.currentNoteId = noteMsgId;
  ctx.session.currentMenuId = ctx.callbackQuery.message.message_id;
  await ctx.editMessageText(
    '📌 Вы можете отправить новый текст, изображение, видео, аудио или документ, ' +
      'и я обновлю содержимое заметки.\n\n' +
      'Просто отправьте новое содержимое для вашей заметки или используйте /reset для отмены операции.',
    {
      reply_markup: new InlineKeyboard().add({
        text: '🔙 Отмена',
        callback_data: `${callbackEnum.CANCEL_EDIT_NOTE}`,
      }),
    },
  );
}

export async function cancelEdit(ctx: CustomContext) {
  ctx.session.state = botState.idle;
  await returnNoteMenu(ctx, ctx.session.currentNoteId, ctx.session.currentMenuId);
  ctx.session.currentNoteId = undefined;
  ctx.session.currentMenuId = undefined;
}
