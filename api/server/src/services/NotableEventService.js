import database from '../models';

class NotableEventService {
  static getEvents(limit) {
    return database.NotableEvent.findAndCountAll({
      limit,
      order: [['updatedAt', 'DESC']],
    });
  }

  static addEvent(event) {
    return database.NotableEvent.create(event);
  }

}

export default NotableEventService;
