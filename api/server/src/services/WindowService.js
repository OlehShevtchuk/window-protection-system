import database from '../models';

class WindowService {
  static getAllWindows() {
    return database.Window.findAll();
  }

  static getWindowInZoneByName(name, ZoneId) {
    return database.Window.findOne({
      where: { name, ZoneId },
    });
  }

  static addWindow(newWindow) {
    return database.Window.create(newWindow);
  }

  static async updateWindow(id, updateWindow) {
    const windowToUpdate = await database.Window.findOne({
      where: { id: Number(id) },
    });
    if (windowToUpdate) {
      await database.Window.update(updateWindow, { where: { id: Number(id) } });
      return updateWindow;
    }
    return null;
  }

  static async getAWindow(id) {
    const theWindow = await database.Window.findOne({
      where: { id: Number(id) },
    });

    return theWindow;
  }

  static async deleteWindow(id) {
    const windowToDelete = await database.Window.findOne({
      where: { id: Number(id) },
    });

    if (windowToDelete) {
      const deletedWindow = await database.Window.destroy({
        where: { id: Number(id) },
      });
      return deletedWindow;
    }
    return null;
  }
}

export default WindowService;
