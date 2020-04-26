import map from 'lodash/map';
import get from 'lodash/get';
import fetch from 'node-fetch';
import { AUTH_URL } from '../constants';

export default async function supplementEventsWithUserInfo(
  events,
  authorizationToken,
) {
  return Promise.all(
    map(events, async event => {
      try {
        if (event.UserId) {
          const responseFromUserService = await fetch(
            `${AUTH_URL}/user/${event.UserId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: authorizationToken,
              },
            },
          );
          const responseJson = await responseFromUserService.json();
          if (get(responseJson, 'status') === 'error') {
            return event;
          }
          const userInfo = get(responseJson, 'data');
          return {
            ...event,
            userName: get(userInfo, 'userName'),
            currentImage: get(userInfo, 'currentImage'),
          };
        }
        return event;
      } catch (error) {
        console.info(error);
        return event;
      }
    }),
  );
}
