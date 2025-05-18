import { botState } from '../types/bot-state';
import { CustomContext } from '../types/custom-context.interface';

export async function onReset(ctx: CustomContext) {
  if (ctx.session.state !== botState.idle) {
    ctx.session.state = botState.idle;
    return await ctx.reply('Действие отменено');
  }
}
