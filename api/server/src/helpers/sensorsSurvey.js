import forEach from 'lodash/forEach';
import get from 'lodash/get';

import ModeService from '../services/ModeService';
import SensorService from '../services/SensorService';
import IssueService from '../services/IssueService';
import PushNotificationService from '../services/PushNotificationService';
import { MAIN_MODE_ID } from '../constants';
import { getOpenConnections } from '../controllers/IssueController';
import sendPushNotification from '../utils/SendPushNotification';

// from 1 to 0
const PERCENT_OF_INACTIVE_CASE = 0.1;

function randomizeSensorValue(sensor) {
  const isActive = Math.random() > PERCENT_OF_INACTIVE_CASE;

  let batteryCharge = sensor.batteryCharge - Math.floor(Math.random() * 10);
  if (batteryCharge < 0) batteryCharge = 0;

  if (isActive) {
    return {
      batteryCharge: 0 || batteryCharge,
      type: sensor.type,
      isOpen: sensor.isOpen,
      isBroken: false,
    };
  }
  return null;
}

export default async function survaySensors() {
  try {
    // simulation of sensor data acquisition
    const sensors = await SensorService.getAllSensors();
    const mode = get(await ModeService.getAMode(MAIN_MODE_ID), 'dataValues');
    // if system disarmed or no sensors do nothing
    if (get(sensors, 'length') === 0 || !mode.isActive) return null;
    const recivers = await PushNotificationService.getAllSubscription();
    forEach(sensors, async sensor => {
      const generatedSensorData = randomizeSensorValue(sensor);
      const genBatteryCharge = get(generatedSensorData, 'batteryCharge');
      const isOpen = get(generatedSensorData, 'isOpen');
      const isBroken = get(generatedSensorData, 'isBroken');

      let isDiffOpenCloseSensorState = false;
      if (sensor.type === 'open/close') {
        isDiffOpenCloseSensorState = isOpen !== sensor.isOpen;
      }

      // if successefylly connect with sensor and sensor does`t detect alarm
      if (
        genBatteryCharge &&
        !isBroken &&
        !isDiffOpenCloseSensorState &&
        sensor.status !== 'alarm'
      ) {
        let message = sensor.msg;
        let status = sensor.status;
        if (genBatteryCharge < 10) {
          message = 'Battery low, time to install a new battery!';
          status = 'warning';
        }
        const response = await SensorService.updateSensor(sensor.id, {
          isOpen,
          batteryCharge: genBatteryCharge,
          msg: message,
          status,
        });
        console.info(JSON.stringify(response));
      } else {
        // otherwise create issue
        const createdIssue = await IssueService.addIssue({
          sensorDatabaseId: sensor.id,
          sensorType: sensor.type,
          isOpen,
          isActive: !!genBatteryCharge,
          isBroken,
        });
        if (createdIssue) {
          const openConnections = getOpenConnections();
          console.info('------------------------------');
          console.info(createdIssue);
          if (openConnections) {
            forEach(openConnections, async user => {
              await user.response.write(
                `event: issueOccured\ndata: ${JSON.stringify(
                  createdIssue,
                )}\n\n`,
              );
            });
          }
          const issuePayload = {
            title: 'Alarm!!!',
            text: get(createdIssue, 'issueText'),
            tag: 'alarm',
            icon: 'windows-protection-alert.png',
            badge: 'windows-protection-house-badge.png',
            timestamp: Date.now(),
            actions: [
              {
                action: 'Detail',
                title: 'View',
              },
            ],
            url: '/windows-protection',
          };
          forEach(recivers, async reciver => {
            try {
              await sendPushNotification(
                {
                  endpoint: reciver.endpoint,
                  p256dh: reciver.p256dh,
                  auth: reciver.auth,
                },
                issuePayload,
              );
            } catch (error) {
              console.info(error);
            }
          });
        }
      }
    });
    return null;
  } catch (error) {
    console.info(error);
    return null;
  }
}
