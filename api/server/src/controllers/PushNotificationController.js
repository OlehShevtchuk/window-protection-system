import get from 'lodash/get';
import forEach from 'lodash/forEach';
import keys from '../config/keys';
import Util from '../utils/Utils';
import PushNotificationService from '../services/PushNotificationService';

const util = new Util();

class PushNotificationController {
  static async subscribe(request, response) {
    const endpoint = get(request, 'body.endpoint');
    const p256dh = get(request, 'body.keys.p256dh');
    const auth = get(request, 'body.keys.auth');
    if (!endpoint || !p256dh || !auth) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    try {
      const createdSubscription = await PushNotificationService.addSubscription(
        {
          endpoint,
          p256dh,
          auth,
        },
      );
      const subscribePayload = {
        title: 'Congratulations!',
        text: 'You successfully subscribe to receving push notifications!',
        tag: 'subscribed',
        badge: 'windows-protection-house-badge.png',
        actions: [],
        url: null,
      };
      await PushNotificationService.sendPushNotification(
        { endpoint, p256dh, auth },
        subscribePayload,
      );
      util.setSuccess(201, 'Subcibed successfully', createdSubscription);
      return util.send(response);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }

  static async unsubscribe(request, response) {
    const endpoint = get(request, 'body.endpoint');
    if (!endpoint) {
      util.setError(400, 'Please provide a complete details!');
      return util.send(response);
    }
    try {
      const deletedSubscription = await PushNotificationService.deleteSubscription(
        endpoint,
      );
      if (deletedSubscription) {
        util.setSuccess(200, 'Succesfully unsubscribed!');
      } else {
        util.setError(
          404,
          `Subscription with the endpoint ${endpoint} cannot be found`,
        );
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static getPublicKey(request, response) {
    const pushServerPublicKey = keys.publicKey;
    if (pushServerPublicKey) {
      util.setSuccess(200, 'Key retrived!', { pushServerPublicKey });
      util.send(response);
    } else {
      util.setError(500, 'no key!');
      util.send(response);
    }
  }

  static async push(request, response) {
    const payload = {
      title: 'New Product Available ',
      text: 'HEY! Take a look at this brand new t-shirt!',
      image: 'pushIcon.png',
      tag: 'new-product',
      url: '/windows-protection',
    };

    const pushPayload = JSON.stringify(payload);

    const recivers = await PushNotificationService.getAllSubscription();
    forEach(recivers, async reciver => {
      try {
        await PushNotificationService.sendPushNotification(
          {
            endpoint: reciver.endpoint,
            p256dh: reciver.p256dh,
            auth: reciver.auth,
          },
          pushPayload,
        );
      } catch (error) {
        console.info(error);
      }
    });
    util.setSuccess(200, 'Push  sent succesfully');
    return util.send(response);
  }
}

export default PushNotificationController;
