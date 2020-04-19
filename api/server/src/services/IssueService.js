import sequelize from 'sequelize';
import get from 'lodash/get';
import database from '../models';

import SensorService from './SensorService';
import WindowService from './WindowService';

class IssueService {
  static getAllIssues() {
    return database.Issue.findAll();
  }

  static async addIssue(parameters) {
    // params - params from sensor
    const {
      sensorDatabaseId,
      sensorType,
      isOpen,
      isActive,
      isBroken,
    } = parameters;
    console.info(parameters);

    const completeSersorData = await SensorService.getACompleteSensorInfo(
      sensorDatabaseId,
    );
    if (!get(completeSersorData, 'id')) return null;
    const windowDatabaseType = get(completeSersorData, 'type');
    if (windowDatabaseType !== sensorType) return null;
    const sensorDatabaseIsOpen = get(completeSersorData, 'isOpen');
    const windowDatabaseName = get(completeSersorData, 'Window.name');
    const zoneDatabaseName = get(completeSersorData, 'Window.Zone.name');
    const windowId = get(completeSersorData, 'WindowId');
    const sensorDatabaseStatus = get(completeSersorData, 'status');
    const sensorDatabaseIsActive = get(completeSersorData, 'isActive');

    let issueText;
    let isSilence;
    let windowStatus;
    if (sensorType === 'open/close') {
      // Window is opened and sensor active and sensor in db closed
      if (isOpen && isActive && !sensorDatabaseIsOpen) {
        issueText = `BURGLARY ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Opened`;
        isSilence = false;
        windowStatus = 'hacked';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'alarm',
          msg: 'Window is hacked',
          isOpen: true,
          isActive: true,
          lastAlarmDate: sequelize.literal('CURRENT_TIMESTAMP'),
        });
      }
      // Event(Window closed) existing  data in database (sensor active and sensor in db open)
      if (!isOpen && isActive && sensorDatabaseIsOpen) {
        issueText = `BURGLARY ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Closed`;
        isSilence = false;
        windowStatus = 'hacked';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'alarm',
          msg: 'Window is hacked',
          isActive: true,
          lastAlarmDate: sequelize.literal('CURRENT_TIMESTAMP'),
        });
      }
      // Sensor is not active but was in Alarm status
      if (!issueText && sensorDatabaseStatus === 'alarm' && !isActive) {
        issueText = `BURGLARY ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Opened. But now connection with this sensor lost`;
        isSilence = true;
        windowStatus = 'inactive';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'inactive',
          msg: 'Sensor was in alarm status but now connection lost',
          isActive: false,
        });
      }
      // Sensor is not active and sensor was not in Alarm status and sensor not inactive in sensor table(Issue notification show only once)
      if (
        !issueText &&
        sensorDatabaseStatus !== 'alarm' &&
        !isActive &&
        sensorDatabaseIsActive
      ) {
        issueText = `Open/close sensor on ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Inactive, connection with this sensor lost`;
        isSilence = true;
        windowStatus = 'inactive';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'inactive',
          msg: 'Connection with sensor lost',
          isActive: false,
        });
      }
    }
    if (sensorType === 'glass break') {
      // Window is broken
      if (isBroken && isActive) {
        issueText = `BREAK ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Broken`;
        isSilence = false;
        windowStatus = 'broken';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'alarm',
          msg: 'Window is broken',
          isActive: true,
          lastAlarmDate: sequelize.literal('CURRENT_TIMESTAMP'),
        });
      }
      // Sensor is not active but was in Alarm status
      if (!issueText && sensorDatabaseStatus === 'alarm' && !isActive) {
        issueText = `BREAK ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Broken. But now connection with this sensor lost`;
        isSilence = true;
        windowStatus = 'inactive';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'inactive',
          msg: 'Sensor was in alarm status but now connection lost',
          isActive: false,
        });
      }
      // Sensor is not active and sensor was not in Alarm status and sensor not inactive in sensor table(Issue notification show only once)

      if (
        !issueText &&
        sensorDatabaseStatus !== 'alarm' &&
        !isActive &&
        sensorDatabaseIsActive
      ) {
        issueText = `Break sensor on ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Inactive, connection with this sensor lost`;
        isSilence = true;
        windowStatus = 'inactive';
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'inactive',
          msg: 'Connection with sensor lost',
          isActive: false,
        });
      }
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

    // update WindowStatus
    await WindowService.updateWindow(windowId, {
      status: windowStatus,
      accidentDate: sequelize.literal('CURRENT_TIMESTAMP'),
    });

    return newIssue;
  }

  static async updateIssue(id, updateIssue) {
    const issueToUpdate = await database.Issue.findOne({
      where: { id: Number(id) },
    });

    if (issueToUpdate) {
      await database.Issue.update(updateIssue, { where: { id: Number(id) } });

      return updateIssue;
    }
    return null;
  }

  static async deleteIssue(id) {
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
        console.info('status')
        console.info('status');
        console.info('status');
        console.info(type)
        console.info(isOpen);
        console.info(status);
        console.info(message);
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
      const deletedIssue = await database.Issue.destroy({
        where: { id: Number(id) },
      });
      return deletedIssue;
    }
    return null;
  }
}

export default IssueService;
