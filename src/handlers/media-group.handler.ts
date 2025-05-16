import { CustomContext } from '../types/custom-context.interface';

export async function isMediaGroup(ctx: CustomContext): Promise<boolean> {
  if (ctx.msg.media_group_id) {
    if (ctx.session.lastMediaGruopId !== ctx.msg.media_group_id) {
      ctx.session.lastMediaGruopId = ctx.msg.media_group_id;
      ctx.reply(
        '😔 Медиагруппы не поддерживается ботом.\nПожалуйста, отправляйте файлы по одному!',
      );
      return true;
    }
    return true;
  }
  return false;
}
