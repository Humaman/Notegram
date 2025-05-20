import { MenuFlavor } from '@grammyjs/menu';
import { User } from '@prisma/client';
import { Context, SessionFlavor } from 'grammy';

export interface NoteQuery {
  text: string;
  folder: number;
  index: number;
}

export interface SessionData {
  state: string; // текущее состояние взаимодействия (например, "создание заметки")
  user: User; // объект пользователя
  currentNoteId: number; // ID текущей заметки
  currentMenuId: number; // ID текущего активного меню
  lastMediaGruopId: string; // последний ID группы медиа (например, при загрузке фото)
  noteQuery: NoteQuery; // параметры текущего поиска заметок
  previousNoteId: number; // ID предыдущей заметки, для навигации
  reminderDate: Date; // дата напоминания, если установлена
}

export type CustomContext = Context & SessionFlavor<SessionData> & MenuFlavor;
