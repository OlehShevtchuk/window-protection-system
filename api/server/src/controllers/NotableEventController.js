import paginate from 'jw-paginate';
import NotableEventService from '../services/NotableEventService';
import Util from '../utils/Utils';
import supplementEventsWithUserInfo from '../helpers/supplementEventsWithUserInfo';

const util = new Util();

class NotableEventCoontroller {
  static async getNotableEvents(request, response) {
    console.info('----------');
    const authorizationToken = request.header('Authorization');
    console.info(request.query);
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 1;

    try {
      const { count, rows } = await NotableEventService.getEvents(limit, page);
      if (count > 0) {
        const supplementedRows = await supplementEventsWithUserInfo(rows, authorizationToken);
        const pager = paginate(count, page, limit);
        util.setSuccess(200, 'Events retrieved', {
          pager,
          events: supplementedRows,
        });
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
