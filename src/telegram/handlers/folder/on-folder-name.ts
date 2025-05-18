import { botState } from '../../types/bot-state';
import { CustomContext } from '../../types/custom-context.interface';

export async function onFolderName(ctx: CustomContext) {
  const title = ctx.msg.text;
  if (title.length > 32) return onBadFolderName;
  try {
    await prisma.folder.create({
      data: { title: title, user: { connect: { id: ctx.session.user.id } } },
    });
    await ctx.reply(`Новая папка успешно создана!`, {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  } catch (e) {
    await ctx.reply(`Произошла ошибка при создании папки. Попробуйте снова.`);
    console.error('Ошибка при создании папки в Prisma', e);
  } finally {
    ctx.session.state = botState.idle;
  }
}

export async function onBadFolderName(ctx: CustomContext) {
  return await ctx.reply(
    'Пожалуйста отправьте сообщение с название папки длинной не более 32 символов',
    {
      reply_parameters: { message_id: ctx.msg.message_id },
    },
  );
}

export async function onCommandAsFolderName(ctx: CustomContext) {
  return await ctx.reply('Пожалуйста не используйте команды как название папки', {
    reply_parameters: { message_id: ctx.msg.message_id },
  });
}
