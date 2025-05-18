import { ReminderStatus } from '@prisma/client';

import { CustomContext } from '../../types/custom-context.interface';

export async function onConfirmReminder(ctx: CustomContext) {
  const reminderId: number = Number(ctx.match[1]);
  const messageId = ctx.callbackQuery.message.message_id;

  const note = ctx.callbackQuery?.message?.text ?? ctx.callbackQuery?.message?.caption;
  let text;

  let reminder = await prisma.reminder.findUnique({ where: { id: reminderId } });

  if (reminder.status === ReminderStatus.CONFIRMED) {
    text =
      note +
      `\n✔️ Это напоминание уже было подтверждено: ${reminder.updated_at.toLocaleString('ru-RU')}`;
  } else {
    reminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: { status: ReminderStatus.CONFIRMED },
    });

    text = note + `\n✔️ Подтверждено: ${reminder.updated_at.toLocaleString('ru-RU')}`;
  }

  if (ctx.callbackQuery?.message?.text) {
    return await ctx.api.editMessageText(ctx.chat.id, messageId, text, { reply_markup: null });
  }
  if (ctx.callbackQuery?.message?.caption) {
    return await ctx.api.editMessageCaption(ctx.chat.id, messageId, {
      caption: text,
      reply_markup: null,
    });
  }
}
