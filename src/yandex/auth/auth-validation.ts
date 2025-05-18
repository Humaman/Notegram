import dotenv from 'dotenv';
dotenv.config();

import { AuthQuery } from './auth-query';

const allowedRedirectUris = ['https://social.yandex.net/broker/redirect'];

export function validateAuthParams(query: AuthQuery): { valid: boolean; message?: string } {
  const { client_id, redirect_uri, state, response_type } = query;

  const missingParams: string[] = [];

  if (!client_id) missingParams.push('client_id');
  if (!redirect_uri) missingParams.push('redirect_uri');
  if (!state) missingParams.push('state');
  if (!response_type) missingParams.push('response_type');

  if (missingParams.length > 0) {
    return {
      valid: false,
      message: `Missing required parameters: ${missingParams.join(', ')}`,
    };
  }

  if (response_type !== 'code') {
    return { valid: false, message: 'Invalid response_type' };
  }

  if (client_id !== process.env.YANDEX_CLIENT_ID) {
    return { valid: false, message: 'Invalid client_id' };
  }

  if (!allowedRedirectUris.includes(redirect_uri)) {
    return { valid: false, message: 'Invalid redirect_uri' };
  }

  return { valid: true };
}
