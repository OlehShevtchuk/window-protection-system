import sequelize from 'sequelize';
import get from 'lodash/get';
import database from '../models';

import SensorService from './SensorService';
import WindowService from './WindowService';
import NotableEventService from './NotableEventService';
import createOpenCloseStatusParameters from '../helpers/createOpenCloseStatusParameters';
import createBreakStatusParameters from '../helpers/createBreakStatusParameters';

const ISSUE_EVENT_SOURCE = 'Security System';

class IssueService {
  static getAllIssues() {
    return database.Issue.findAll();
  }

  static async addIssue(parameters) {
    // params - params from sensor
    const {
      sensorDatabaseId,
      sensorType,
      isOpen = false,
      isActive = false,
      isBroken = false,
    } = parameters;
    console.info(parameters);
    try {
      const completeSersorData = await SensorService.getACompleteSensorInfo(
        sensorDatabaseId,
      );

      // if no sensor with this id
      if (!get(completeSersorData, 'id')) return null;

      const sensorDatabaseIsOpen = get(completeSersorData, 'isOpen');
      const windowDatabaseName = get(completeSersorData, 'Window.name');
      const zoneDatabaseName = get(completeSersorData, 'Window.Zone.name');
      const windowId = get(completeSersorData, 'WindowId');
      const sensorDatabaseStatus = get(completeSersorData, 'status');
      const sensorDatabaseIsActive = get(completeSersorData, 'isActive');

      let issueText;
      let isSilence;
      let windowStatus;
      let sensorStatus;
      let sensorMessage;

      if (sensorType === 'open/close') {
        ({
          issueText,
          isSilence,
          windowStatus,
          sensorStatus,
          sensorMessage,
        } = createOpenCloseStatusParameters({
          sensorDatabaseIsOpen,
          windowDatabaseName,
          zoneDatabaseName,
          sensorDatabaseStatus,
          sensorDatabaseIsActive,
          isOpen,
          isActive,
        }));
      }

      if (sensorType === 'glass break') {
        ({
          issueText,
          isSilence,
          windowStatus,
          sensorStatus,
          sensorMessage,
        } = createBreakStatusParameters({
          windowDatabaseName,
          zoneDatabaseName,
          sensorDatabaseStatus,
          sensorDatabaseIsActive,
          isBroken,
          isActive,
        }));
      }

      if (!issueText) return null;

      // checking is exist same issue in same sensor

      const issueDublicate = await database.Issue.findAll({
        where: {
          issueText,
          SensorId: sensorDatabaseId,
        },
      });
      console.info(issueText);
      if (issueDublicate.length > 0) return null;
      const newIssue = await database.Issue.create({
        issueText,
        isSilence,
        SensorId: sensorDatabaseId,
      });
      console.info('added new issue');

      // update sensor data in db
      await SensorService.updateSensor(sensorDatabaseId, {
        status: sensorStatus,
        msg: sensorMessage,
        isOpen,
        isActive,
        lastAlarmDate: sequelize.literal('CURRENT_TIMESTAMP'),
      });

      // update WindowStatus
      await WindowService.updateWindow(windowId, {
        status: windowStatus,
        accidentDate: sequelize.literal('CURRENT_TIMESTAMP'),
      });

      // add issue to NotableEvents table
      await NotableEventService.addEvent({
        eventText: issueText,
        eventSource: ISSUE_EVENT_SOURCE,
      });
      console.info('added new notable event');

      return newIssue;
    } catch (error) {
      return null;
    }
  }

  static async updateIssue(id, updatedIssue, user) {
    try {
      const issueToUpdate = await database.Issue.findOne({
        where: { id: Number(id) },
      });

      if (issueToUpdate) {
        await database.Issue.update(updatedIssue, {
          where: { id: Number(id) },
        });

        // add silence event to NotableEvents table
        const notableEventText = `${get(
          issueToUpdate,
          'dataValues.issueText',
        )} is set to silence by ${get(user, 'userName')}`;

        await NotableEventService.addEvent({
          eventText: notableEventText,
          eventSource: 'user',
          UserId: get(user, 'id'),
        });
        console.info('added new notable event');

        return { updatedIssue, notableEventText };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static async deleteIssue(id, user) {
    try {
      const issueToDelete = await database.Issue.findOne({
        where: { id: Number(id) },
      });

      const sensorToUpdateData = await SensorService.getASensor(
        Number(get(issueToDelete, 'SensorId')),
      );

      if (issueToDelete && sensorToUpdateData) {
        const sensorToUpdate = get(sensorToUpdateData, 'dataValues');
        const isActive = get(sensorToUpdate, 'isActive');
        const isOpen = get(sensorToUpdate, 'isOpen');
        const batteryCharge = get(sensorToUpdate, 'batteryCharge');
        const type = get(sensorToUpdate, 'type');
        const windowId = get(sensorToUpdate, 'WindowId');

        if (isActive) {
          let message = null;
          let status = 'ok';
          let windowStatus = 'closed';

          if (type === 'open/close' && isOpen) {
            status = 'warning';
            message = 'Window is open';
            windowStatus = 'open';
          } else if (batteryCharge < 10) {
            status = 'warning';
            message = 'Battery low, time to install a new battery!';
          }

          // update sensor
          await SensorService.updateSensor(get(sensorToUpdate, 'id'), {
            status,
            msg: message,
          });

          // update WindowStatus
          await WindowService.updateWindow(windowId, {
            status: windowStatus,
            accidentDate: sequelize.literal('CURRENT_TIMESTAMP'),
          });
        }
        console.info('added new notable event');
        const deletedIssue = await database.Issue.destroy({
          where: { id: Number(id) },
        });

        // add clear issue event to NotableEvents table
        await NotableEventService.addEvent({
          eventText: `${get(
            issueToDelete,
            'dataValues.issueText',
          )} cleared by ${get(user, 'userName')}`,
          eventSource: 'user',
          UserId: get(user, 'id'),
        });

        return deletedIssue;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default IssueService;
