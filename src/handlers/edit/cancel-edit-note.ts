import { botState } from '../../types/bot-state';
import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

export async function cancelEdit(ctx: CustomContext) {
  const noteMsgId = ctx.match[1];
  ctx.session.state = botState.idle;
  ctx.session.editNoteId = undefined;
  await returnNoteMenu(ctx, noteMsgId);
}
