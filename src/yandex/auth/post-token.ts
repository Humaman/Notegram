import dotenv from 'dotenv';

import { generateAccessToken } from '../../common/jwt';
dotenv.config();

export async function postToken(req, reply) {
  console.log('[SERVER POST] /token');
  const { grant_type, code, redirect_uri, client_id, client_secret } = req.body as any;

  if (grant_type !== 'authorization_code') {
    return reply.code(400).send({ error: 'unsupported_grant_type' });
  }

  if (
    client_id !== process.env.YANDEX_CLIENT_ID ||
    client_secret !== process.env.YANDEX_CLIENT_SECRET
  ) {
    return reply.code(401).send({ error: 'invalid_client' });
  }

  const allowedRedirectUris = ['https://social.yandex.net/broker/redirect'];
  if (!allowedRedirectUris.includes(redirect_uri)) {
    return reply.code(400).send({ error: 'invalid_redirect_uri' });
  }

  const authCode = await prisma.authCode.findUnique({ where: { code }, include: { user: true } });

  if (
    !authCode ||
    authCode.expiresAt < new Date() ||
    authCode.clientId !== client_id ||
    authCode.redirectUri !== redirect_uri
  ) {
    return reply.code(400).send({ error: 'invalid_grant' });
  }

  const accessToken = generateAccessToken(authCode.user.id.toString());
  const expiresIn = 3600;

  await prisma.authCode.delete({ where: { code } });

  const rep = {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: expiresIn,
  };

  return reply.send(rep);
}
