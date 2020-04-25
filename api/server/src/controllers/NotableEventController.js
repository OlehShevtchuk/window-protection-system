import NotableEventService from '../services/NotableEventService';
import Util from '../utils/Utils';

const util = new Util();

class NotableEventCoontroller {
  static async getNotableEvents(request, response) {
    const { limit = 0, offset = 0 } = request.query;
    try {
      const allEvents = await NotableEventService.getEvents(limit, offset);
      if (allEvents.length > 0) {
        util.setSuccess(200, 'Events retrieved', allEvents);
      } else {
        util.setSuccess(200, 'No event found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default NotableEventCoontroller;
