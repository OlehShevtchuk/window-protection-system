import ZoneService from '../services/ZoneService';
import Util from '../utils/Utils';

const util = new Util();

class ZoneController {
  static async getAllZones(request, response) {
    try {
      const allZones = await ZoneService.getAllZones();
      if (allZones.length > 0) {
        util.setSuccess(200, 'Zones retrieved', allZones);
      } else {
        util.setSuccess(200, 'No zone found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async addZone(request, response) {
    if (!request.body.name || !request.body.xCoord || !request.body.yCoord) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    const newZone = request.body;
    try {
      const createdZone = await ZoneService.addZone(newZone);
      util.setSuccess(201, 'Zone Added!', createdZone);
      return util.send(response);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }

  static async updatedZone(request, response) {
    const alteredZone = request.body;
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }
    try {
      const updateZone = await ZoneService.updateZone(id, alteredZone);
      if (!updateZone) {
        util.setError(404, `Cannot find zone with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Zone updated', updateZone);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async getAZone(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }

    try {
      const theZone = await ZoneService.getAZone(id);

      if (!theZone) {
        util.setError(404, `Cannot find zone with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Zone', theZone);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async deleteZone(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }

    try {
      const zoneToDelete = await ZoneService.deleteZone(id);

      if (zoneToDelete) {
        util.setSuccess(200, 'Zone deleted');
      } else {
        util.setError(404, `Zone with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default ZoneController;
