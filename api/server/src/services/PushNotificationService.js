import webPush from 'web-push';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import keys from '../config/keys';
import database from '../models';

class PushNotificationService {
  static async addSubscription(subscription) {
    return database.PushSubscription.create(subscription);
  }

  static async deleteSubscription(endpoint) {
    try {
      const subscriptionToDelete = await database.PushSubscription.findOne({
        where: { endpoint },
      });
      if (subscriptionToDelete) {
        const deletedSubscription = await database.PushSubscription.destroy({
          where: { id: subscriptionToDelete.dataValues.id },
        });
        return deletedSubscription;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static async getAllSubscription() {
    return database.PushSubscription.findAll({ raw: true });
  }

  static async sendAlarmToAllSubscription(issue) {
    try {
      const recivers = await PushNotificationService.getAllSubscription();
      const issuePayload = {
        title: 'Alarm!!!',
        text: get(issue, 'issueText'),
        tag: 'alarm',
        icon: 'windows-protection-alert.png',
        badge: 'windows-protection-house-badge.png',
        timestamp: Date.now(),
        actions: [
          {
            action: 'Detail',
            title: 'View',
          },
        ],
        url: '/windows-protection',
      };
      forEach(recivers, async reciver => {
        try {
          await this.sendPushNotification(
            {
              endpoint: reciver.endpoint,
              p256dh: reciver.p256dh,
              auth: reciver.auth,
            },
            issuePayload,
          );
        } catch (error) {
          console.info(error);
        }
      });
      return true;
    } catch (error) {
      return null;
    }
  }

  static sendPushNotification(subscription, payload) {
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
        subject: 'http://security-system.com',
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
      },
      TTL: payload.ttl,
      headers: {},
    };
    return webPush.sendNotification(pushSubscription, pushPayload, pushOptions);
  }
}

export default PushNotificationService;
