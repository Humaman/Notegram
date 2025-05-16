import { mainMenu, mainMenuText } from '../menu/main.menu';
import { CustomContext } from '../types/custom-context.interface';

export async function onMainMenu(ctx: CustomContext) {
  return ctx.reply(mainMenuText, { reply_markup: mainMenu });
}
