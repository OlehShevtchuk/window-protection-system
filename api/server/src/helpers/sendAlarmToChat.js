import fetch from 'node-fetch';
import get from 'lodash/get';
import { CHAT_API } from '../constants';

export default function sendAlarmToChat(issue) {
  return fetch(CHAT_API, {
    method: 'POST',
    body: JSON.stringify({
      text: get(issue, 'issueText'),
      UserId: '200',
      imageAttachment: null,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
