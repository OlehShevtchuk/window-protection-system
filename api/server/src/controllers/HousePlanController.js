import { promises as fs } from 'fs';
import get from 'lodash/get';
import AwsService from '../services/AwsService';
import HousePlanService from '../services/HousePlanService';
import Util from '../utils/Utils';
import { HOUSE_PLAN_ID } from '../constants';

const util = new Util();

class HousePlanController {
  static async getPlan(request, response) {
    try {
      const housePlan = await HousePlanService.getAPlan(HOUSE_PLAN_ID);
      if (!housePlan) {
        util.setError(400, 'No plan');
        return util.send(response);
      }
      const planUrl = get(housePlan, 'dataValues.url');
      util.setSuccess(201, 'Plan retrieved!', { planUrl });
      return util.send(response);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    }
  }

  static async upload(request, response) {
    const housePlan = get(request, 'files.housePlan');
    try {
      // if there is no housePlan
      if (!housePlan) {
        util.setError(400, 'No file uploaded');
        return util.send(response);
      }
      const fileData = await fs.readFile(housePlan.tempFilePath);
      const dataFromAws = await AwsService.uploadFile(housePlan, fileData);
      if (!dataFromAws) {
        util.setError(400, 'Problem with storage!');
        return util.send(response);
      }
      const housePlanDataToAwsDelete = await HousePlanService.getAPlan(
        HOUSE_PLAN_ID,
      );

      const [record, created] = await HousePlanService.addPlan(HOUSE_PLAN_ID, {
        url: get(dataFromAws, 'Location'),
        key: get(dataFromAws, 'Key'),
      });
      const previousKey = get(housePlanDataToAwsDelete, 'key');

      if (!created && previousKey) {
        await AwsService.deleteFile(previousKey);
      }

      util.setSuccess(201, 'Plan Changed!', { url: get(record, 'url') });
      return util.send(response);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    } finally {
      try {
        if (housePlan) fs.unlink(get(housePlan, 'tempFilePath'));
      } catch (error) {
        console.info(error);
      }
    }
  }
}

export default HousePlanController;
