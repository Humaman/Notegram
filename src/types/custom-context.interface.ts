import { User } from '@prisma/client';
import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
  // будет по `ctx.session.myContextProp`
  state: string;
  user: User;
  menuId: string;
  lastMediaGruopId: string;
  editNoteId: string;
}
export type CustomContext = Context & SessionFlavor<SessionData>;
