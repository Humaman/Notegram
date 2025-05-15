import { InlineKeyboard } from 'grammy';

import { botState } from '../../types/bot-state';
import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';

export async function noteEditHandler(ctx: CustomContext) {
  const noteMsgId = ctx.match[1];

  ctx.session.state = botState.editNote;
  ctx.session.editNoteId = noteMsgId || undefined;

  await ctx.editMessageText(
    '📌 Вы можете отправить новый текст, изображение, видео, аудио или документ, ' +
      'и я обновлю содержимое заметки.\n\n' +
      'Просто отправьте новое содержимое для вашей заметки или используйте /reset для отмены операции.',
    {
      reply_markup: new InlineKeyboard().add({
        text: '🔙 Отмена',
        callback_data: `${callbackEnum.CANCEL_EDIT_NOTE_}${noteMsgId}`,
      }),
    },
  );
}
