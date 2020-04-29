import database from '../models';

class SensorService {
  static getAllSensors() {
    return database.Sensor.findAll({
      raw: true,
      include: {
        model: database.Window,
        attributes: ['name'],
        include: {
          model: database.Zone,
          attributes: ['name'],
        },
      },
    });
  }

  static getAllActiveSensorsIds() {
    return database.Sensor.findAll({
      attributes: ['id'],
      where: { isActive: true },
    });
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
    return database.Sensor.findOne({
      where: { id: Number(id) },
    });
  }

  static async getACompleteSensorInfo(id) {
    return database.Sensor.findOne({
      raw: true,
      where: { id: Number(id) },
      include: {
        model: database.Window,
        attributes: ['name'],
        include: {
          model: database.Zone,
          attributes: ['name'],
        },
      },
    });
  }

  static async deleteSensor(id) {
    try {
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
    } catch (error) {
      return error;
    }
  }
}

export default SensorService;
