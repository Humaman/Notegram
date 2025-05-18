import { escapeHTML } from '../../common/escapeHTML';

import { AuthQuery } from './auth-query';

export function authFormHTML(query: AuthQuery) {
  return `
<form method="POST" action="/auth">
  <input type="hidden" name="client_id" value="${escapeHTML(query.client_id)}" />
  <input type="hidden" name="redirect_uri" value="${escapeHTML(query.redirect_uri)}" />
  <input type="hidden" name="state" value="${escapeHTML(query.state)}" />
  <input type="hidden" name="response_type" value="${escapeHTML(query.response_type)}" />
  <input type="hidden" name="scope" value="${escapeHTML(query.scope || '')}" />
  <label>Введите пароль из Telegram-бота:</label><br />
  <input type="password" name="password" placeholder="Пароль из телеграм-бота" required />
  <br />
  <button type="submit">Подтвердить</button>
</form>
  `;
}
