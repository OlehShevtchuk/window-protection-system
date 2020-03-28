import database from '../models';

class ZoneService {
  static getAllZones() {
    return database.Zone.findAll();
  }

  static addZone(newZone) {
    return database.Zone.create(newZone);
  }

  static async updateZone(id, updateZone) {
    const zoneToUpdate = await database.Zone.findOne({
      where: { id: Number(id) },
    });

    if (zoneToUpdate) {
      await database.Zone.update(updateZone, { where: { id: Number(id) } });

      return updateZone;
    }
    return null;
  }

  static async getAZone(id) {
    const theZone = await database.Zone.findOne({
      where: { id: Number(id) },
    });

    return theZone;
  }

  static async deleteZone(id) {
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
  }
}

export default ZoneService;
