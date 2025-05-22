import { Bot } from 'grammy';

import { verifyAccessToken } from '../../common/jwt';
import { CustomContext } from '../../telegram/types/custom-context.interface';

export function makeResponce(text: string) {
  return {
    response: {
      text: text,
    },
    version: '1.0',
  };
}

const welcomeMessage =
  'Привет! Я умею создавать напоминания и заметки. Просто скажи: «Поставь напоминание» или «Добавь заметку». Начнём?';

const onAuth = 'Вижу, вы вошли! Давайте приступать!';

const fallback =
  'Хм, не удалось распознать команду. Попробуй что-то вроде: «Добавь напоминание» или «Создай заметку».';

async function sendTemplateToTG(userId: string, bot: Bot<CustomContext>) {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  await bot.api.sendMessage(user.tg_id, 'Привет, я пример сообщения от Алисы.');
}

export async function dialog(req, bot: Bot<CustomContext>) {
  const accessToken = req?.session?.user?.access_token;
  const intents = req?.request?.nlu?.intents;
  let tokenData = verifyAccessToken(accessToken);
  if (req.session?.new && accessToken) return makeResponce(welcomeMessage);
  if (!accessToken) {
    tokenData = undefined;
    return getAuthCardResponse();
  }
  if (req?.account_linking_complete_event) {
    //tokenData = verifyAccessToken(accessToken);
    return makeResponce(onAuth);
  }
  if (intents?.create_reminder) {
    await sendTemplateToTG(tokenData.userId, bot);
    return makeResponce(
      'Хорошо, давай создадим напоминание... Извини, модерация яндекса не успела одобрить обработку текста. Давай я отправлю тестовое сообщение для демонстрации.',
    );
  }
  if (intents?.create_note) {
    await sendTemplateToTG(tokenData.userId, bot);
    return makeResponce(
      'Хорошо, давай создадим заметку... Извини, модерация яндекса не успела одобрить обработку текста. Давай я отправлю тестовое сообщение для демонстрации.',
    );
  }
  return makeResponce(fallback);
}

function getAuthCardResponse() {
  return {
    start_account_linking: {},
    version: '1.0',
    end_session: false,
  };
}
