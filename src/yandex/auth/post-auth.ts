import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

import { generateOneTimePassword } from '../../common/create-user';

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
  if (!user) return reply.status(400).send('Invalid password');

  await prisma.user.update({
    where: { id: user.id },
    data: { yandex_password: generateOneTimePassword(user.tg_id) },
  });

  const authCode = uuidv4();

  await prisma.authCode.create({
    data: {
      code: authCode,
      user: { connect: { id: user.id } },
      clientId: query.client_id,
      redirectUri: query.redirect_uri,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 минут
    },
  });

  const redirectUrl = new URL(query.redirect_uri);
  redirectUrl.searchParams.append('code', authCode);
  redirectUrl.searchParams.append('state', query.state);

  return reply.redirect(redirectUrl.toString());
}
