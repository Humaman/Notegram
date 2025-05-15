import { Menu } from '@grammyjs/menu';
import { Note } from '@prisma/client';

import { CustomContext } from '../types/custom-context.interface';

import { backToMenu } from './main.menu';

export const noteMenu = new Menu<CustomContext>('note-menu')
  .text('⬅️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .text('➡️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .text('➡️', async (ctx: CustomContext) => await ctx.reply('You pressed A!'))
  .row()
  .text('🔙 Назад', async (ctx: CustomContext) => await backToMenu(ctx));

async function nextNote(ctx) {}

async function prevNote(ctx) {}

export async function getNote(ctx: CustomContext, noteId?: number) {
  let note;
  if (!noteId) {
    note = await prisma.note.findFirst({
      where: {
        userId: ctx.session.user.id, // подставь нужный ID
        isTrashed: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
  return note ?? null;
}

export async function drawNote(ctx, note: Note | null) {
  const text = note?.text || note.caption || 'У вас нет ни одной заметки';
  await ctx.api.editMessageText(ctx.chat.id, ctx.callbackQuery.message.messageId, text);
}

export const noteMenuText =
  '📋 Меню заметок. Вы можете: \n\n1️⃣ Просматривать заметки.\n' +
  '2️⃣ Управлять папками и группами заметок.\n' +
  '3️⃣ Редактировать напоминания.\n\n' +
  '📌 Просто выберите интересующую опцию на клавиатуре.';
