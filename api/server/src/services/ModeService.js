import database from '../models';

class ModeService {

  static addMode(newMode) {
    return database.Mode.create(newMode);
  }

  static async updateMode(id, updateMode) {
    const modeToUpdate = await database.Mode.findOne({
      where: { id: Number(id) },
    });

    if (modeToUpdate) {
      await database.Mode.update(updateMode, { where: { id: Number(id) } });

      return updateMode;
    }
    return null;
  }

  static async getAMode(id) {
    const theMode = await database.Mode.findOne({
      where: { id: Number(id) },
    });

    return theMode;
  }
}

export default ModeService;
