import get from 'lodash/get';
import ModeService from '../services/ModeService';
import NotableEventService from '../services/NotableEventService';
import Util from '../utils/Utils';
import { MAIN_MODE_ID } from '../constants';
import { hub } from '../helpers/sseHub';

const util = new Util();

class ModeController {
  static async addMode(request, response) {
    if (!request.body.name) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    const newMode = request.body;
    try {
      const createdMode = await ModeService.addMode(newMode);
      util.setSuccess(201, 'Mode Added!', createdMode);
      return util.send(response);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }

  static async updatedModeStatus(request, response) {
    const { isArmed } = request.body;
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }
    try {
      const updateMode = await ModeService.updateMode(id, {
        isActive: isArmed,
      });
      if (!updateMode) {
        util.setError(404, `Cannot find mode with the id: ${id}`);
      } else {
        let message;
        if (isArmed) {
          message = 'Security system Armed';
        } else {
          message = 'Security system Disarmed';
        }
        await NotableEventService.addEvent({
          eventText: `${message}`,
          eventSource: 'user',
          UserId: get(response, 'locals.user.id'),
        });
        util.setSuccess(200, message, updateMode);
      }
      await util.send(response);
      const event = hub.event('systemStatusChanged', isArmed);
      return event;
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async getAMode(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }

    try {
      const theMode = await ModeService.getAMode(id);

      if (!theMode) {
        util.setError(404, `Cannot find mode with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Mode', theMode);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async getMainMode(request, response) {
    try {
      const theMode = await ModeService.getAMode(MAIN_MODE_ID);

      if (!theMode) {
        util.setError(404, `Mode node exist!`);
      } else {
        util.setSuccess(200, 'Found Mode', theMode);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async setMainModeStatus(request, response) {
    const { isArmed } = request.body;
    try {
      const updateMode = await ModeService.updateMode(MAIN_MODE_ID, {
        isActive: isArmed,
      });
      if (!updateMode) {
        util.setError(404, `Cannot find mode`);
      } else {
        let message;
        if (isArmed) {
          message = 'Security system Armed';
        } else {
          message = 'Security system Disarmed';
        }
        await NotableEventService.addEvent({
          eventText: `${message}`,
          eventSource: 'user',
          UserId: get(response, 'locals.user.id'),
        });
        util.setSuccess(200, message, updateMode);
      }
      await util.send(response);
      const event = hub.event('systemStatusChanged', isArmed);
      return event;
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default ModeController;
