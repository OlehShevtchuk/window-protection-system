import get from 'lodash/get';
import WindowService from '../services/WindowService';
import Util from '../utils/Utils';

const util = new Util();

class WindowController {
  static async getAllWindows(request, response) {
    try {
      const allWindows = await WindowService.getAllWindows();
      if (allWindows.length > 0) {
        util.setSuccess(200, 'Windows retrieved', allWindows);
      } else {
        util.setSuccess(200, 'No windows found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }

  static async addWindow(request, response) {
    if (!request.body.name || !request.body.ZoneId) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    const newWindow = request.body;
    const newWindowWithDefaultData = {
      ...newWindow,
      status: get(newWindow, 'status', 'closed'),
      accidentDate: get(newWindow, 'accidentDate', null),
    };
    try {
      const windowWithSameName = await WindowService.getWindowInZoneByName(
        newWindowWithDefaultData.name,
        newWindowWithDefaultData.ZoneId,
      );
      if (windowWithSameName) {
        util.setError(
          400,
          `In this zone window with name ${newWindowWithDefaultData.name} alredy exist`,
        );
        return util.send(response);
      }

      const createdWindow = await WindowService.addWindow(
        newWindowWithDefaultData,
      );
      util.setSuccess(201, 'Window Added!', createdWindow);
      return util.send(response);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    }
  }

  static async updatedWindow(request, response) {
    const alteredWindow = request.body;
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }
    try {
      const windowToUpdate = await WindowService.getAWindow(id);
      if (!windowToUpdate) {
        util.setError(404, `Cannot find window with the id: ${id}`);
      }
      
      if (
        get(alteredWindow, 'name') &&
        windowToUpdate.name !== alteredWindow.name
      ) {
        const windowWithSameName = await WindowService.getWindowInZoneByName(
          alteredWindow.name,
          windowToUpdate.ZoneId,
        );
        if (windowWithSameName) {
          util.setError(
            400,
            `In this zone window with name ${windowWithSameName.name} alredy exist`,
          );
          return util.send(response);
        }
      }

      await WindowService.updateWindow(id, alteredWindow);
      util.setSuccess(200, 'Window updated', alteredWindow);
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }

  static async getAWindow(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }

    try {
      const theWindow = await WindowService.getAWindow(id);

      if (!theWindow) {
        util.setError(404, `Cannot find window with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Window', theWindow);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }

  static async deleteWindow(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }

    try {
      const windowToDelete = await WindowService.deleteWindow(id);

      if (windowToDelete) {
        util.setSuccess(200, 'Window deleted');
      } else {
        util.setError(404, `Window with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }
}

export default WindowController;
