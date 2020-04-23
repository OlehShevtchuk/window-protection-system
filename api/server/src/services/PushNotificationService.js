import database from '../models';

class PushNotificationService {
  static async addSubscription(subscription) {
    return database.PushSubscription.create(subscription);
  }

  static async deleteSubscription(endpoint) {
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
  }

  static async getAllSubscription() {
    return database.PushSubscription.findAll({raw: true});
  }
}

export default PushNotificationService;
