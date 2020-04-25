import database from '../models';

class HousePlanService {
  static async addPlan(id, housePlan) {
    return database.HousePlan.upsert(
      { ...housePlan, id: Number(id) },
      { returning: true }, // Record to upsert
    );
  }

  static async getAPlan(id) {
    return  database.HousePlan.findOne({
      where: { id: Number(id) },
    });
  }
}

export default HousePlanService;
