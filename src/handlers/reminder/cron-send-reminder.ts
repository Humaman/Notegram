import { Note, Reminder } from '@prisma/client';
import { Bot, InlineKeyboard } from 'grammy';

import { callbackEnum } from '../../types/callback.enum';
import { CustomContext } from '../../types/custom-context.interface';

export async function cronSendReminder(
  bot: Bot<CustomContext>,
  reminder: Reminder,
  note: Note,
  userTgId: string,
) {
  const kb = getReminderKb(reminder.id);

  if (note?.text) {
    const text = reminderTextWrap(note.text, reminder);
    return await bot.api.sendMessage(userTgId, text, { reply_markup: kb });
  }

  if (note?.caption) {
    const caption = reminderTextWrap(note.caption, reminder);
    if (note?.image)
      return await bot.api.sendPhoto(userTgId, note.image, { caption, reply_markup: kb });
    if (note?.video)
      return await bot.api.sendVideo(userTgId, note.video, { caption, reply_markup: kb });
    if (note?.audio)
      return await bot.api.sendAudio(userTgId, note.audio, { caption, reply_markup: kb });
    if (note?.doc)
      return await bot.api.sendDocument(userTgId, note.doc, { caption, reply_markup: kb });
  }
}

function reminderTextWrap(text: string, reminder: Reminder) {
  const formatedCreatedAt = reminder.created_at.toLocaleString('ru-RU');
  const formatedRemindAt = reminder.remindAt.toLocaleString('ru-RU');

  const wrapedText =
    `⏰ Напонимание на ${formatedRemindAt}\n\n` + text + `\n\n🌱 Создано ${formatedCreatedAt}`;
  return wrapedText;
}

export function getReminderKb(reminderId: number): InlineKeyboard {
  return new InlineKeyboard().text(
    '✅ Подтвердить',
    ` ${callbackEnum.CONFIRM_NOTIFICATION_}${reminderId}`,
  );
}
