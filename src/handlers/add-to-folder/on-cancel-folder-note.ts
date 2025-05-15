import { CustomContext } from '../../types/custom-context.interface';
import { returnNoteMenu } from '../note/return-note-menu';

export async function onCancelFolderNote(ctx: CustomContext) {
  const noteMessageId = ctx.match[1];
  await returnNoteMenu(ctx, noteMessageId);
}
