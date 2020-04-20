import database from '../models';

class HousePlanService {
  static async addPlan(id, housePlan) {
    return database.HousePlan.upsert(
      { ...housePlan, id: Number(id) },
      { returning: true }, // Record to upsert
    );
  }

  static async getAPlan(id) {
    const thePlan = await database.HousePlan.findOne({
      where: { id: Number(id) },
    });
    return thePlan;
  }
}

export default HousePlanService;
