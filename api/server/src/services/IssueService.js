import sequelize from 'sequelize';
import get from 'lodash/get';
import database from '../models';

import SensorService from './SensorService';

class IssueService {
  static getAllIssues() {
    return database.Issue.findAll();
  }

  static async addIssue(parameters) {
    // params - params from sensor
    const { sensorId, sensorType, isOpen, isActive, isBroken } = parameters;

    const sersorDatabaseData = await database.Sensor.findOne({
      where: { sensorId: Number(sensorId) },
    });

    if (!sersorDatabaseData) return null;

    const sensorDatabaseId = get(sersorDatabaseData, 'id');
    const completeSersorData = await SensorService.getACompleteSensorInfo(
      sensorDatabaseId,
    );

    // const isSystemArmed = database.Mode.findOne({ where: { isActive: true } });
    // if (!isSystemArmed) return null;
    const windowDatabaseType = get(completeSersorData, 'type');
    if (windowDatabaseType !== sensorType) return null;
    const windowDatabaseName = get(completeSersorData, 'Window.name');
    const zoneDatabaseName = get(completeSersorData, 'Window.Zone.name');
    const sensorDatabaseStatus = get(completeSersorData, 'status');
    const sensorDatabaseIsActive = get(completeSersorData, 'isActive');

    let issueText;
    let isSilence;
    if (sensorType === 'open/close') {
      // Window is opened
      if (isOpen) {
        issueText = `BURGLARY ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Opened`;
        isSilence = false;
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
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'inactive',
          msg: 'Connection with sensor lost',
          isActive: false,
        });
      }
    }
    if (sensorType === 'glass break') {
      // Window is broken
      if (isBroken) {
        issueText = `BREAK ALARM ${windowDatabaseName} (Zone ${zoneDatabaseName}) - Broken`;
        isSilence = false;
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
        await SensorService.updateSensor(sensorDatabaseId, {
          status: 'inactive',
          msg: 'Connection with sensor lost',
          isActive: false,
        });
      }
    }

    if (!issueText) return null;

    // checking is exist same issue in same sensorId

    const issueDublicate = await database.Issue.findAll({
      where: {
        issueText,
        SensorId: sensorDatabaseId,
      },
    });
    if (issueDublicate.length > 0) return null;

    const newIssue = await database.Issue.create({
      issueText,
      isSilence,
      SensorId: sensorDatabaseId,
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

    const sensorToUpdate = await SensorService.getASensor(
      Number(get(issueToDelete, 'SensorId')),
    );

    if (issueToDelete && sensorToUpdate) {
      if (sensorToUpdate.status !== 'inactive') {
        await SensorService.updateSensor(sensorToUpdate.id, {
          status: 'ok',
          msg: null,
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
