import database from '../models';

class ZoneService {
  static getAllZones() {
    return database.Zone.findAll();
  }

  static addZone(newZone) {
    return database.Zone.create(newZone);
  }

  static async updateZone(id, updateZone) {
    try {
      const zoneToUpdate = await database.Zone.findOne({
        where: { id: Number(id) },
      });

      if (zoneToUpdate) {
        await database.Zone.update(updateZone, { where: { id: Number(id) } });

        return updateZone;
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  static async getAZone(id) {
    return database.Zone.findOne({
      where: { id: Number(id) },
    });
  }

  static async deleteZone(id) {
    try {
      const zoneToDelete = await database.Zone.findOne({
        where: { id: Number(id) },
      });

      if (zoneToDelete) {
        const deletedZone = await database.Zone.destroy({
          where: { id: Number(id) },
        });
        return deletedZone;
      }
      return null;
    } catch (error) {
      return error;
    }
  }
}

export default ZoneService;
