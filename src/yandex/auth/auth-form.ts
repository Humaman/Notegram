import { AuthQuery } from './auth-query';

export function authFormHTML(query: AuthQuery) {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Авторизация</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    form {
      background: white;
      padding: 24px 32px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-width: 400px;
      width: 100%;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    input[type="password"] {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      margin-bottom: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 16px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <form method="POST" action="/auth">
    <input type="hidden" name="client_id" value="${escapeHTML(query.client_id)}" />
    <input type="hidden" name="redirect_uri" value="${escapeHTML(query.redirect_uri)}" />
    <input type="hidden" name="state" value="${escapeHTML(query.state)}" />
    <input type="hidden" name="response_type" value="${escapeHTML(query.response_type)}" />
    <input type="hidden" name="scope" value="${escapeHTML(query.scope || '')}" />
    <label>Введите пароль из Notegramm-бота:</label>
    <input type="password" name="password" placeholder="Пароль из Notegramm" required />
    <button type="submit">Подтвердить</button>
  </form>
</body>
</html>
`;
}

function escapeHTML(str: string = ''): string {
  return String(str).replace(/["&<>]/g, (s) => {
    const escape: Record<string, string> = {
      '"': '&quot;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };
    return escape[s] || s;
  });
}
