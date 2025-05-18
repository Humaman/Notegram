import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { AuthQuery, getAuthQuery } from './auth-query';
import { validateAuthParams } from './auth-validation';
dotenv.config();

export async function postAuth(req, reply) {
  console.log('[SERVER POST] /auth');

  const password = req.body.password;
  const query: AuthQuery = getAuthQuery(req.body);

  const validation = validateAuthParams(query);
  if (!validation.valid) {
    return reply.status(400).send(validation.message);
  }

  const user = await prisma.user.findUnique({ where: { yandex_password: password } });
  if (!user) {
    return reply.status(400).send('Invalid password');
  }

  await prisma.user.update({
    where: { id: user.id, yandex_id_active: false },
    data: {
      yandex_id_active: true,
      yandex_id: 'Пока не знаю где его взять',
    },
  });
  // После успешной аутентификации генерируем код авторизации
  const authCode = uuidv4(); // Здесь генерируется твой код авторизации (например, UUID)

  await prisma.authCode.create({
    data: {
      code: authCode,
      user: { connect: { id: user.id } },
      clientId: query.client_id,
      redirectUri: query.redirect_uri,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 минут
    },
  });

  // Формируем URL для редиректа с кодом авторизации
  const redirectUrl = new URL(query.redirect_uri);
  redirectUrl.searchParams.append('code', authCode); // Добавляем параметр code с авторизационным кодом
  redirectUrl.searchParams.append('state', query.state); // Добавляем параметр state для защиты от CSRF

  // Выполняем редирект на указанный redirect_uri
  return reply.redirect(redirectUrl.toString());
}
