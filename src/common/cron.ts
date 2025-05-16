import { ReminderStatus } from '@prisma/client';
import { Bot } from 'grammy';
import cron from 'node-cron';

import { cronSendReminder } from '../handlers/reminder/cron-send-reminder';
import { CustomContext } from '../types/custom-context.interface';

export function startBotMessageScheduler(bot: Bot<CustomContext>) {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const reminders = await prisma.reminder.findMany({
      where: {
        OR: [
          {
            remindAt: { lte: now },
            status: ReminderStatus.PENDING,
          },
          {
            // Повторная отправка через 5 минут если не подтверждено
            updated_at: { lte: new Date(now.getTime() - 5 * 60 * 1000) },
            retryCount: { lt: 3 }, // максимум 3 попытки
            status: ReminderStatus.SENT,
          },
        ],
      },
      include: { note: true, user: true },
    });

    for (const rem of reminders) {
      try {
        console.log(`[CRON] Отправляю напоминание пользователю: ${rem.userId}`);

        await cronSendReminder(bot, rem, rem.note, rem.user.tg_id);
        await prisma.reminder.update({
          where: { id: rem.id },
          data: {
            retryCount: rem.retryCount + 1,
            status: ReminderStatus.SENT,
          },
        });
      } catch (err) {
        console.error(
          `[CRON] Ошибка при отправке сообщения ID ${rem.id}, пользователю: ${rem.userId}:`,
          err,
        );
      }
    }
  });

  console.log('[CRON] Scheduler запущен');
}
