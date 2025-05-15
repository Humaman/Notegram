import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';

import { callbackEnum } from '../../types/callback.enum';

export function getFolderKb(messageId: string): InlineKeyboard {
  return new InlineKeyboard()
    .add(getCreateFolder())
    .add(getEditNoteInline(messageId))
    .row()
    .add(getCreateNotificationInline(messageId))
    .add(getDeleteNoteInline(messageId));
}

export function getCreateFolder(): InlineKeyboardButton {
  const button = {
    text: `📁 Создать папку`,
    callback_data: callbackEnum.FOLDER_CREATE,
  };
  return button;
}

export function getEditNoteInline(messageId: string): InlineKeyboardButton {
  const button = {
    text: `✏️ Редактировать`,
    callback_data: `${callbackEnum.EDIT_NOTE_}${messageId}`,
  };
  return button;
}

export function getCreateNotificationInline(messageId: string): InlineKeyboardButton {
  const button = {
    text: `⏰ Создать напоминание`,
    callback_data: `${callbackEnum.NOTIFY_NOTE_}${messageId}`,
  };
  return button;
}

export function getDeleteNoteInline(messageId: string): InlineKeyboardButton {
  const button = {
    text: `🗑 В корзину`,
    callback_data: `${callbackEnum.TRASH_NOTE_}${messageId}`,
  };
  return button;
}
