import { ReminderStatus } from '@prisma/client';

import { CustomContext } from '../../types/custom-context.interface';

export async function onConfirmReminder(ctx: CustomContext) {
  const reminderId: number = Number(ctx.match[1]);
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: ReminderStatus.CONFIRMED },
  });

  const text = ctx.callbackQuery?.message?.text ?? ctx.callbackQuery?.message?.caption;

  const messageId = ctx.callbackQuery.message.message_id;

  if (ctx.callbackQuery?.message?.text) {
    return await ctx.api.editMessageText(
      ctx.chat.id,
      messageId,
      text + '\n' + `✔️ Подтверждено: ${reminder.updated_at}`,
      { reply_markup: null },
    );
  }
  if (ctx.callbackQuery?.message?.caption) {
    return await ctx.api.editMessageCaption(ctx.chat.id, messageId, {
      caption: text + '\n' + `✔️ Подтверждено: ${reminder.updated_at}`,
      reply_markup: null,
    });
  }
}
