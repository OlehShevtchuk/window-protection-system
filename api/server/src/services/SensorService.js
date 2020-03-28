import database from '../models';

class SensorService {
  static getAllSensors() {
    return database.Sensor.findAll();
  }

  static addSensor(newSensor) {
    return database.Sensor.create(newSensor);
  }

  static async updateSensor(id, updateSensor) {
    const sensorToUpdate = await database.Sensor.findOne({
      where: { id: Number(id) },
    });

    if (sensorToUpdate) {
      await database.Sensor.update(updateSensor, { where: { id: Number(id) } });

      return updateSensor;
    }
    return null;
  }

  static async getASensor(id) {
    const theSensor = await database.Sensor.findOne({
      where: { id: Number(id) },
    });

    return theSensor;
  }

  static async deleteSensor(id) {
    const sensorToDelete = await database.Sensor.findOne({
      where: { id: Number(id) },
    });

    if (sensorToDelete) {
      const deletedSensor = await database.Sensor.destroy({
        where: { id: Number(id) },
      });
      return deletedSensor;
    }
    return null;
  }
}

export default SensorService;
