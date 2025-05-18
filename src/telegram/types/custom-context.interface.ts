import { MenuFlavor } from '@grammyjs/menu';
import { User } from '@prisma/client';
import { Context, SessionFlavor } from 'grammy';

export interface NoteQuery {
  text: string;
  folder: number;
  index: number;
}

export interface SessionData {
  // будет по `ctx.session.myContextProp`
  state: string;
  user: User;
  currentNoteId: number;
  currentMenuId: number;
  lastMediaGruopId: string;
  noteQuery: NoteQuery;
  previousNoteId: number;
  reminderDate: Date;
}
export type CustomContext = Context & SessionFlavor<SessionData> & MenuFlavor;
