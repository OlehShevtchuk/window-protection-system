import get from 'lodash/get';
import IssueService from '../services/IssueService';
import Util from '../utils/Utils';
import { hub } from '../helpers/sseHub';

const util = new Util();
export class IssueController {
  static async getAllIssues(request, response) {
    try {
      const allIssues = await IssueService.getAllIssues();
      if (allIssues.length > 0) {
        util.setSuccess(200, 'Issues retrieved', allIssues);
      } else {
        util.setSuccess(200, 'No issue found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async addIssue(request, response) {
    const { sensorDatabaseId, sensorType } = request.body;
    console.log(request.body);
    if (
      !sensorDatabaseId ||
      !sensorType ||
      (!('isActive' in request.body) &&
        (!('isOpen' in request.body) || !('isBroken' in request.body)))
    ) {
      util.setError(400, 'Please provide complete details');
      return util.send(response);
    }
    const newIssueData = request.body;
    try {
      const createdIssue = await IssueService.addIssue(newIssueData);
      if (!createdIssue) {
        util.setError(400, `Can not create Issue with this incoming data`);
        return util.send(response);
      }
      util.setSuccess(201, 'Issue Added!', createdIssue);
      return util.send(response);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }

  static async updatedIssue(request, response) {
    const { isSilence } = request.body;
    const { id } = request.params;

    if (!Number(id)) {
      util.setError(400, 'Please input a valid numeric value');
      return util.send(response);
    }
    try {
      const { updatedIssue } = await IssueService.updateIssue(
        id,
        { isSilence },
        get(response, 'locals.user'),
      );
      if (!updatedIssue) {
        util.setError(404, `Cannot find issue with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Issue updated', updatedIssue);
      }

      await util.send(response);
      return hub.event('issueChanged', id);
    } catch (error) {
      util.setError(500, error);
      console.info(error)
      return util.send(response);
    }
  }

  static async deleteIssue(request, response) {
    const { id } = request.params;
    if (!Number(id)) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(response);
    }
    try {
      const issueToDelete = await IssueService.deleteIssue(
        id,
        get(response, 'locals.user'),
      );

      if (issueToDelete) {
        util.setSuccess(200, 'Issue deleted');
      } else {
        util.setError(404, `Issue with the id ${id} cannot be found`);
      }
      await util.send(response);
      return hub.event('issueChanged', id);
    } catch (error) {
       console.info(error);
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export async function eventsSse(request, response) {
  console.info('----------------------------------');
  console.info(hub.clients);
  response.sse.event('welcome', "Welcome! You'll now receive realtime events");
  console.info('----------------------------------');
  console.info('----------------------------------');
  console.info('----------------------------------');
  console.info(hub.clients);
}
