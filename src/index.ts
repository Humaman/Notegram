import { Router } from '@grammyjs/router';
import dotenv from 'dotenv';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { Bot, session } from 'grammy';

import { InlineDebugMiddleware } from './bot-middleware/inline-debug-log.middleware';
import { PrismaGetUserMiddleware } from './bot-middleware/prisma-get-user.middleware';
import { onFolder } from './commands/folder.command';
import { onNewMenu } from './commands/menu.command';
import { onReset } from './commands/reset.command';
import { onStart } from './commands/start.command';
import { onAddToFolder } from './handlers/add-to-folder/on-add-to-folder';
import { onCancelFolderNote } from './handlers/add-to-folder/on-cancel-folder-note';
import { onFolderNote } from './handlers/add-to-folder/on-folder-note';
import { cancelEdit } from './handlers/edit/cancel-edit-note';
import { noteEditHandler } from './handlers/edit/edit-note-handler';
import { onEditedNote } from './handlers/edit/on-edited-note';
import { getNoteFromMsg } from './handlers/get-note-from-msg';
import { isMediaGroup } from './handlers/media-group.handler';
import {
  onFolderName,
  onBadFolderName,
  onCommandAsFolderName,
} from './handlers/new-folder/on-folder-name';
import { noteHandler } from './handlers/note/note-handler';
import { onCancelTrashNote, onTrashNote } from './handlers/trash-bin/on-trash';
import { folderMenu } from './menu/folder.menu';
import { mainMenu, mainMenuText } from './menu/main.menu';
import { noteMenu } from './menu/note.menu';
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
        menuId: undefined,
        lastMediaGruopId: undefined,
        editNoteId: undefined,
      };
    },
  }),
);

bot.use(mainMenu);
mainMenu.register(noteMenu);
mainMenu.register(folderMenu);
mainMenu.register(notifyMenu);

bot.use(InlineDebugMiddleware);
bot.use(PrismaGetUserMiddleware);

bot.command('start', async (ctx) => await onStart(ctx));
bot.command('reset', async (ctx) => await onReset(ctx));
bot.command('menu', async (ctx) => await onNewMenu(ctx, mainMenuText, mainMenu));

const router = new Router<CustomContext>((ctx: CustomContext) => ctx.session.state);

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

const idle = router.route(botState.idle);
//COMMANDS
idle.command('folder', async (ctx) => await onFolder(ctx));

//FOLDER HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.FOLDER_NOTE_}(\\d+)`),
  async (ctx) => await onFolderNote(ctx),
);

idle.callbackQuery(
  new RegExp(`^${callbackEnum.CANCEL_FOLDER_NOTE_}(\\d+)`),
  async (ctx) => await onCancelFolderNote(ctx),
);

idle.callbackQuery(
  new RegExp(`^${callbackEnum.ADD_NOTE_TO_FOLDER_}(\\d+)_(\\d+)`),
  async (ctx) => await onAddToFolder(ctx),
);

//EDIT NOTE HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.EDIT_NOTE_}(\\d+)`),
  async (ctx) => await noteEditHandler(ctx),
);
idle.callbackQuery(
  new RegExp(`^${callbackEnum.CANCEL_EDIT_NOTE_}(\\d+)`),
  async (ctx) => await cancelEdit(ctx),
);

//TRASH NOTE HANDLERS
idle.callbackQuery(
  new RegExp(`^${callbackEnum.TRASH_NOTE_}(\\d+)`),
  async (ctx) => await onTrashNote(ctx),
);
idle.callbackQuery(
  new RegExp(`^${callbackEnum.CANCEL_TRASH_NOTE_}(\\d+)`),
  async (ctx) => await onCancelTrashNote(ctx),
);

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

    await bot.start();
    console.log('🤖 Бот запущен через polling');
  } catch (err) {
    console.error('Ошибка запуска:', err);
    process.exit(1);
  }
};

start();
