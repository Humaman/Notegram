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

export async function dialog(req) {
  const accessToken = req?.session?.user?.access_token;
  const intents = req?.request?.nlu?.intents;

  if (req.session?.new && accessToken) return makeResponce(welcomeMessage);
  if (!accessToken) return getAuthCardResponse();
  if (req?.account_linking_complete_event) return makeResponce(onAuth);
  if (intents?.create_reminder) return makeResponce('Хорошо, давай создадим напоминание');
  if (intents?.create_note) return makeResponce('Хорошо, давай создадим заметку');

  return makeResponce(fallback);
}

function getAuthCardResponse() {
  return {
    start_account_linking: {},
    version: '1.0',
    end_session: false,
  };
}
