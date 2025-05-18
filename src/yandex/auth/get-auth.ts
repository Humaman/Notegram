import { authFormHTML } from './auth-form';
import { AuthQuery, getAuthQuery } from './auth-query';
import { validateAuthParams } from './auth-validation';

export async function getAuth(req, reply) {
  console.log('[SERVER Get] /auth');

  const query: AuthQuery = getAuthQuery(req.query);

  const validation = validateAuthParams(query);

  if (!validation.valid) {
    return reply.status(400).send(validation.message);
  }

  return reply.type('text/html; charset=utf-8').send(authFormHTML(query));
}
