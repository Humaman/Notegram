import * as chrono from 'chrono-node';
import { InlineKeyboard } from 'grammy';

import { botState } from '../../types/bot-state';
import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

export async function onNewReminder(ctx: CustomContext) {
  ctx.session.currentNoteId = Number(ctx.match[1]);
  ctx.session.currentMenuId = ctx.callbackQuery.message.message_id;

  const kb = new InlineKeyboard()
    .text('📅 Ввести дату', callbackEnum.ENTER_REMINDER_DATE)
    .text('🔙 Отмена', callbackEnum.CANCEL_NEW_REMINDER);

  const note = await prisma.note.findUnique({
    where: { messageId: ctx.session.currentNoteId },
    include: { reminder: true },
  });

  let text;
  if (note.reminder)
    text =
      `📝 У заметки есть напоминание на ${note.reminder.remindAt.toLocaleString('ru-RU')}!\n\n` +
      '⏰ Вы можете изменить дату и время, нажав "📅 Ввести дату".';
  else
    text =
      '📝 Давайте создадим напоминание из этой заметки!\n\n' +
      '⏰ Просто нажмите "📅 Ввести дату", и бот использует ваше сообщение как напоминание.';
  await ctx.editMessageText(text, { reply_markup: kb });
}

export async function onEnterNewReminderDate(ctx: CustomContext) {
  ctx.session.state = botState.reminderDate;
  await ctx.answerCallbackQuery();
  return await ctx.reply(reminderDateText);
}
const reminderDateText =
  '📅 Чтобы создать напоминание, отправьте дату и время.\n\n' +
  '🕒 Примеры:\n' +
  '— завтра в 14:00\n' +
  '— через 2 часа\n' +
  '— 25 мая в 18:30\n' +
  '— в пятницу в 9 утра\n' +
  '— понедельник 10:00';

export async function onReminderDateMessage(ctx: CustomContext) {
  const message: string = ctx.msg.text;
  const parsedDate = chrono.ru.parseDate(message);
  if (parsedDate) {
    ctx.session.reminderDate = parsedDate;
    const kb = new InlineKeyboard().text('✅ Подтвердить', callbackEnum.CREATE_REMINDER);

    await ctx.reply(
      '📅 Распознана дата и время: ' +
        parsedDate.toLocaleString('ru-RU') +
        '\n\nПодтвердите или отправьте другую дату.',
      { reply_markup: kb },
    );
  } else {
    await onBadReminderDateMessage(ctx);
  }
}

export async function onBadReminderDateMessage(ctx: CustomContext) {
  await ctx.reply('Не удалось распознать дату, попробуйте ещё раз 🙂');
}
export async function onCreateReminder(ctx: CustomContext) {
  const noteId = ctx.session.currentNoteId;

  const note = await prisma.note.findUnique({
    where: { messageId: noteId },
    include: { reminder: true },
  });

  const data: any = {
    user: { connect: { id: ctx.session.user.id } },
    note: { connect: { id: note.id } },
    remindAt: ctx.session.reminderDate,
  };

  try {
    let reminder;
    if (note.reminder)
      reminder = await prisma.reminder.update({ where: { id: note.reminder.id }, data });
    else reminder = await prisma.reminder.create({ data });
    await ctx.api.editMessageText(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id,
      `✅ Напоминание на ${reminder.remindAt.toLocaleString('ru-RU')} успешно создано`,
      { reply_markup: null },
    );
    await ctx.answerCallbackQuery('✅ Напоминание успешно создано');
  } catch {
    await ctx.reply('⚠️ Не удалось создать напоминание, пожалуйста попробуйте снова');
  } finally {
    await onCancelNewReminder(ctx);
  }
}

export async function onCancelNewReminder(ctx: CustomContext) {
  const noteId = ctx.session.currentNoteId;
  const menuId = ctx.session.currentMenuId;
  await returnNoteMenu(ctx, noteId, menuId);
  ctx.session.reminderDate = undefined;
  ctx.session.currentNoteId = undefined;
  ctx.session.currentMenuId = undefined;
  ctx.session.state = botState.idle;
}
