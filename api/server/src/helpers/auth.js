import fetch from 'node-fetch';
import get from 'lodash/get';
import { AUTH_URL } from '../constants';

export default async function auth(request, response, next) {
  const authorizationToken = request.header('Authorization');
  const responseFromAuthService = await fetch(AUTH_URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorizationToken,
    },
  });
  const responseJson = await responseFromAuthService.json();
  const user = get(responseJson, 'data');
  if (get(responseJson, 'status') === 'success' && get(user, 'isActive')) {
    response.locals.user = user;
    return next();
  }
  return response.status(401).json({ message: 'Not auth' });
}
