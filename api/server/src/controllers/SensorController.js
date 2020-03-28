import SensorService from '../services/SensorService';
import Util from '../utils/Utils';

const util = new Util();

class SensorController {
  static async getAllSensors(request, response) {
    try {
      const allSensors = await SensorService.getAllSensors();
      if (allSensors.length > 0) {
        util.setSuccess(200, 'Sensors retrieved', allSensors);
      } else {
        util.setSuccess(200, 'No sensor found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }

  static async addSensor(request, response) {
    if (
      !request.body.sensorId ||
      !request.body.xCoord ||
      !request.body.type ||
      !request.body.WindowId ||
      !request.body.yCoord
    ) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    const newZone = request.body;
    // this data will be obtained from a method that attempts to connect to the sensor
    const dataFromSensor = {
      isOpen: false,
      isActive: true,
      status: 'ok',
      batteryCharge: 100,
    };
    const newSensorWithSensorData = {
      ...newZone,
      ...dataFromSensor,
    };
    try {
      const createdSensor = await SensorService.addSensor(newSensorWithSensorData);
      util.setSuccess(201, 'Sensor Added!', createdSensor);
      return util.send(response);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    }
  }

  static async updatedSensor(request, response) {
    const alteredSensor = request.body;
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }
    try {
      const updateSensor = await SensorService.updateSensor(id, alteredSensor);
      if (!updateSensor) {
        util.setError(404, `Cannot find sensor with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Sensor updated', updateSensor);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }

  static async getASensor(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }

    try {
      const theSensor = await SensorService.getASensor(id);

      if (!theSensor) {
        util.setError(404, `Cannot find sensor with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Sensor', theSensor);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }

  static async deleteSensor(request, response) {
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }

    try {
      const sensorToDelete = await SensorService.deleteSensor(id);

      if (sensorToDelete) {
        util.setSuccess(200, 'Sensor deleted');
      } else {
        util.setError(404, `Sensor with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }
}

export default SensorController;
