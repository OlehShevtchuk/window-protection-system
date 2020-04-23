import webPush from 'web-push';
import keys from '../config/keys';

export default  function SendPushNotification(subscription, payload) {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  const pushPayload = JSON.stringify(payload);
  const pushOptions = {
    vapidDetails: {
      subject: 'http://securety-system.com',
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
    },
    TTL: payload.ttl,
    headers: {},
  };
  try {
    return webPush.sendNotification(pushSubscription, pushPayload, pushOptions);
  }
  catch(error) {
      console.info(error);
      return null;
  }
}
