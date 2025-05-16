import { ReminderStatus } from '@prisma/client';

import { CustomContext } from '../../types/custom-context.interface';

export async function onConfirmReminder(ctx: CustomContext) {
  const reminderId: number = Number(ctx.match[1]);
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: ReminderStatus.CONFIRMED },
  });

  let text;
  if (ctx.msg.text) {
    text = ctx.msg?.text;
    return await ctx.editMessageText(text + '\n' + `✔️ Подтверждено: ${reminder.updated_at}`);
  }
  if (ctx.msg.caption) {
    text = ctx.msg?.text;
    return await ctx.editMessageCaption({
      caption: text + '\n' + `✔️ Подтверждено: ${reminder.updated_at}`,
    });
  }
  return await ctx.editMessageReplyMarkup({ reply_markup: null });
}
