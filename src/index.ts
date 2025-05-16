import { Router } from '@grammyjs/router';
import dotenv from 'dotenv';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { Bot, session } from 'grammy';

import { InlineDebugMiddleware } from './bot-middleware/inline-debug-log.middleware';
import { PrismaGetUserMiddleware } from './bot-middleware/prisma-get-user.middleware';
import { onFolder } from './commands/folder.command';
import { onMainMenu } from './commands/menu.command';
import { onReset } from './commands/reset.command';
import { onStart } from './commands/start.command';
import { cancelEdit, noteEditHandler } from './handlers/edit/edit-note-handler';
import { onEditedNote } from './handlers/edit/on-edited-note';
import {
  onFolderName,
  onBadFolderName,
  onCommandAsFolderName,
} from './handlers/folder/on-folder-name';
import { onAddToFolder, onCancelFolderNote, onFolderNote } from './handlers/folder/on-folder-note';
import { getNoteFromMsg } from './handlers/get-note-from-msg';
import { isMediaGroup } from './handlers/media-group.handler';
import { noteHandler } from './handlers/note/note-handler';
import {
  onBadReminderDateMessage,
  onCancelNewReminder,
  onCreateReminder,
  onEnterNewReminderDate,
  onNewReminder,
  onReminderDateMessage,
} from './handlers/reminder/on-create-reminder';
import { onCancelTrashNote, onTrashNote } from './handlers/trash-bin/on-trash';
import { folderMenu } from './menu/folder.menu';
import { mainMenu } from './menu/main.menu';
import { noteViewerMenu } from './menu/note-viewer.menu';
import {
  noteMenu,
  onCancelNoteSearchText,
  onNoNoteSearchText,
  onNoteSearchText,
} from './menu/note.menu';
import { notifyMenu } from './menu/notify.menu';
import { botState } from './types/bot-state';
import { callbackEnum } from './types/callback.enum';
import { CustomContext, SessionData } from './types/custom-context.interface';

dotenv.config();
const TOKEN = process.env.TG_BOT_TOKEN;
const PORT = Number(process.env.PORT);
if (!TOKEN) {
  throw new Error('Check environment variables.');
}

// Fastify server instance
const server = fastify({ logger: true });

const bot = new Bot<CustomContext>(TOKEN);

bot.use(
  session({
    initial(): SessionData {
      return {
        state: botState.idle,
        user: undefined,
        lastMediaGruopId: undefined,
        currentNoteId: undefined,
        currentMenuId: undefined,
        noteQuery: {
          text: undefined,
          folder: undefined,
          index: 0,
        },
        previousNoteId: undefined,
        reminderDate: undefined,
      };
    },
  }),
);
bot.use(InlineDebugMiddleware);
bot.use(PrismaGetUserMiddleware);

bot.use(mainMenu);
mainMenu.register(folderMenu);
mainMenu.register(notifyMenu);
mainMenu.register(noteMenu);
noteMenu.register(noteViewerMenu);

bot.command('start', async (ctx: CustomContext) => await onStart(ctx));
bot.command('reset', async (ctx: CustomContext) => await onReset(ctx));
bot.command('menu', async (ctx: CustomContext) => await onMainMenu(ctx));

const router = new Router<CustomContext>((ctx: CustomContext) => ctx.session.state);

const reminderDate = router.route(botState.reminderDate);

reminderDate.on(':text', async (ctx) => await onReminderDateMessage(ctx));
reminderDate.on('msg', async (ctx) => await onBadReminderDateMessage(ctx));
reminderDate.callbackQuery(
  callbackEnum.CREATE_REMINDER,
  async (ctx) => await onCreateReminder(ctx),
);
reminderDate.callbackQuery(
  callbackEnum.CANCEL_NEW_REMINDER,
  async (ctx) => await onCancelNewReminder(ctx),
);

const noteSearch = router.route(botState.noteSearch);
noteSearch.command('cancel', async (ctx) => await onCancelNoteSearchText(ctx));
noteSearch.on(':text', async (ctx) => await onNoteSearchText(ctx));
noteSearch.on('msg', async (ctx) => await onNoNoteSearchText(ctx));

const newFolder = router.route(botState.newFolder);
newFolder.on('::bot_command', async (ctx) => await onCommandAsFolderName(ctx));
newFolder.on(':text', async (ctx) => await onFolderName(ctx));
newFolder.on('msg', async (ctx) => await onBadFolderName(ctx));

const editNote = router.route(botState.editNote);
editNote.on([':text', ':photo', ':video', ':audio', ':document'], async (ctx) => {
  if (await isMediaGroup(ctx)) return;
  const note = getNoteFromMsg(ctx.msg);
  await onEditedNote(ctx, note);
});
editNote.on('msg', async (ctx) => await ctx.reply('Этот вид файлов не поддерживается ботом 😔'));
editNote.callbackQuery(callbackEnum.CANCEL_EDIT_NOTE, async (ctx) => await cancelEdit(ctx));

const idle = router.route(botState.idle);
//COMMANDS
//TODO убрать
idle.command('folder', async (ctx) => await onFolder(ctx));

//NEW REMINDER HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.NEW_REMINDER_}(\\d+)`),
  async (ctx) => await onNewReminder(ctx),
);
idle.callbackQuery(callbackEnum.CANCEL_NEW_REMINDER, async (ctx) => await onCancelNewReminder(ctx));
idle.callbackQuery(
  new RegExp(`^${callbackEnum.ENTER_REMINDER_DATE}`),
  async (ctx) => await onEnterNewReminderDate(ctx),
);

//FOLDER HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.FOLDER_NOTE_}(\\d+)`),
  async (ctx) => await onFolderNote(ctx),
);

idle.callbackQuery(callbackEnum.CANCEL_FOLDER_NOTE, async (ctx) => await onCancelFolderNote(ctx));

idle.callbackQuery(
  new RegExp(`^${callbackEnum.ADD_NOTE_TO_FOLDER_}(\\d+)_(\\d+)`),
  async (ctx) => await onAddToFolder(ctx),
);

//EDIT NOTE HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.EDIT_NOTE_}(\\d+)`),
  async (ctx) => await noteEditHandler(ctx),
);

//TRASH NOTE HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.TRASH_NOTE_}(\\d+)`),
  async (ctx) => await onTrashNote(ctx),
);
idle.callbackQuery(callbackEnum.CANCEL_TRASH_NOTE, async (ctx) => await onCancelTrashNote(ctx));

//NEW NOTE HANDLERS
idle.on([':text', ':photo', ':video', ':audio', ':document'], async (ctx) => {
  if (await isMediaGroup(ctx)) return;
  const note = getNoteFromMsg(ctx.msg);
  await noteHandler(ctx, note);
});

idle.on('msg', async (ctx) => await ctx.reply('Этот вид файлов не поддерживается ботом 😔'));

bot.use(router);
bot.catch(console.error.bind(console));

server.setErrorHandler(async (error) => {
  console.error(error);
});

// eslint-disable-next-line unusedImports/no-unused-vars
server.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
  return { status: 'ok', message: 'Бот работает' };
});

const start = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log('🚀 Fastify сервер запущен на http://localhost:', PORT);

    await bot.start({ drop_pending_updates: false });
    console.log('🤖 Бот запущен через polling');
  } catch (err) {
    console.error('Ошибка запуска:', err);
    process.exit(1);
  }
};

start();
