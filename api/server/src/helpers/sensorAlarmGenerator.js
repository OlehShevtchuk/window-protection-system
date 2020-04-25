import sample from 'lodash/sample';
import get from 'lodash/get';
import SensorService from '../services/SensorService';
import IssueService from '../services/IssueService';
import ModeService from '../services/ModeService';
import PushNotificationService from '../services/PushNotificationService';
import { MAIN_MODE_ID } from '../constants';
import { hub } from './sseHub';

export default async function sensorAlarmGenerator() {
  try {
    const mode = await ModeService.getAMode(MAIN_MODE_ID);

    // if system disarmed or no sensors do nothing
    if (!get(mode, 'dataValues.isActive')) return null;

    const sensorIds = await SensorService.getAllActiveSensorsIds();

    if (get(sensorIds, 'length') === 0) {
      console.info('no sensors');
      return null;
    }

    // get random sensor
    const eventSensorId = get(sample(sensorIds), 'id');
    const eventSensor = await SensorService.getACompleteSensorInfo(
      eventSensorId,
    );

    let isOpen = false;
    let isBroken = false;
    if (get(eventSensor, 'type') === 'open/close') {
      isOpen = !get(eventSensor, 'isOpen');
    } else {
      isBroken = true;
    }
    const createdIssue = await IssueService.addIssue({
      sensorDatabaseId: get(eventSensor, 'id'),
      sensorType: get(eventSensor, 'type'),
      isOpen,
      isActive: get(eventSensor, 'isActive'),
      isBroken,
    });

    if (createdIssue) {
      hub.event('issueOccured', createdIssue);

      await PushNotificationService.sendAlarmToAllSubscription(createdIssue);
    }
    return true;
  } catch (error) {
    console.info(error);
    return null;
  }
}
