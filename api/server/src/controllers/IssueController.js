import reject from 'lodash/reject';
import forEach from 'lodash/forEach';
import IssueService from '../services/IssueService';
import Util from '../utils/Utils';

const util = new Util();

let openConnections = [];

export const getOpenConnections = () => {
  if (openConnections.length === 0) {
    return null;
  }
  return new Array(...openConnections);
};

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
      util.setError(400, error);
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
      util.setError(400, error.message);
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
      const updateIssue = await IssueService.updateIssue(id, { isSilence });
      if (!updateIssue) {
        util.setError(404, `Cannot find issue with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Issue updated', updateIssue);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
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
      const issueToDelete = await IssueService.deleteIssue(id);

      if (issueToDelete) {
        util.setSuccess(200, 'Issue deleted');
      } else {
        util.setError(404, `Issue with the id ${id} cannot be found`);
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }
}

export async function eventsSse(request, response) {
  console.info('-----------------------');
  console.info('NewUser');
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);
  response.write('\n');

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response,
  };
  // console.info(newClient)
  openConnections.push(newClient);
  console.info(`New client added, qty: ${openConnections.length}`);
  // When client closes connection we update the openConnections list
  // avoiding the disconnected one
  return response.on('close', () => {
    console.log(`${clientId} Connection closed`);
    openConnections = reject(openConnections, c => c.id !== clientId);
  });
}

setInterval(() => {
  console.info(openConnections.length);
  forEach(openConnections, async user => {
    await user.response.write(
      `event: konnection\ndata: keep connection alive\n\n`,
    );
  });
}, 60 * 1000);
