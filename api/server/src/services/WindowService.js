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
    return database.Window.update(updateWindow, {
      where: { id: Number(id) },
    });
  }

  static async getAWindow(id) {
    return database.Window.findOne({
      where: { id: Number(id) },
    });
  }

  static async deleteWindow(id) {
    try {
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
    } catch (error) {
      return error;
    }
  }
}

export default WindowService;
