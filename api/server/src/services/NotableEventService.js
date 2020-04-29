import sequelize from 'sequelize';
import database from '../models';
import { hub } from '../helpers/sseHub';

class NotableEventService {
  static getEvents(limit, page) {
    return database.NotableEvent.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      raw: true,
    });
  }

  static async addEvent(event) {
    const createdEvent = await database.NotableEvent.create(event);
    hub.event('eventOccured', createdEvent.dataValues);
    return createdEvent;
  }

  static async deleteOlder30DaysEvents() {
    try {
      await sequelize.query(
        "DELETE FROM NotableEvents WHERE timestamp < NOW() - INTERVAL '30 days'",
      );
      return true;
    } catch (error) {
      return null;
    }
  }
}

export default NotableEventService;
