import dotenv from 'dotenv';

import { generateAccessToken } from '../common/jwt';
dotenv.config();

export async function postToken(req, reply) {
  console.log('[SERVER POST] /token');
  const { grant_type, code, redirect_uri, client_id, client_secret } = req.body as any;

  // 1. Проверка grant_type
  if (grant_type !== 'authorization_code') {
    return reply.code(400).send({ error: 'unsupported_grant_type' });
  }

  // 2. Проверка client_id и client_secret
  if (
    client_id !== process.env.YANDEX_CLIENT_ID ||
    client_secret !== process.env.YANDEX_CLIENT_SECRET
  ) {
    return reply.code(401).send({ error: 'invalid_client' });
  }

  // 3. Проверка redirect_uri
  const allowedRedirectUris = ['https://social.yandex.net/broker/redirect'];
  if (!allowedRedirectUris.includes(redirect_uri)) {
    return reply.code(400).send({ error: 'invalid_redirect_uri' });
  }

  // 4. Поиск кода авторизации
  const authCode = await prisma.authCode.findUnique({ where: { code }, include: { user: true } });

  if (
    !authCode ||
    authCode.expiresAt < new Date() ||
    authCode.clientId !== client_id ||
    authCode.redirectUri !== redirect_uri
  ) {
    return reply.code(400).send({ error: 'invalid_grant' });
  }

  // 5. Генерация access_token
  const accessToken = generateAccessToken(authCode.user.id.toString()); // Передай в JWT нужные данные
  const expiresIn = 3600;

  // 7. Удалить использованный код (по OAuth-стандарту он одноразовый)
  await prisma.authCode.delete({ where: { code } });

  // 8. Ответ
  return reply.send({
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: expiresIn,
  });
}
