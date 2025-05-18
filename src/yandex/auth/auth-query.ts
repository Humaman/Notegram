export interface AuthQuery {
  client_id: string;
  redirect_uri: string;
  state: string;
  scope?: string;
  response_type: string;
}

export function getAuthQuery(query): AuthQuery {
  const authQuery: AuthQuery = {
    client_id: query.client_id,
    redirect_uri: query.redirect_uri,
    state: query.state,
    scope: query.scope,
    response_type: query.response_type,
  };
  return authQuery;
}
