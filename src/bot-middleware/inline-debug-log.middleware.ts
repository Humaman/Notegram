import { NextFunction } from 'grammy';

import { CustomContext } from '../types/custom-context.interface';

export async function InlineDebugMiddleware(
  ctx: CustomContext,
  next: NextFunction, // is an alias for: () => Promise<void>
): Promise<void> {
  if (ctx.callbackQuery) {
    console.debug(
      '\x1b[33m[Debug Middleware]\x1b[0m Step:',
      ctx.session?.state,
      'Сallback:',
      ctx.callbackQuery?.data,
    );
  }
  await next();
}
