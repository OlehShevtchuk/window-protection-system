import forEach from 'lodash/forEach';
import get from 'lodash/get';

import ModeService from '../services/ModeService';
import SensorService from '../services/SensorService';
import IssueService from '../services/IssueService';
import { MAIN_MODE_ID } from '../constants';
import { getOpenConnections } from '../controllers/IssueController';

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
    forEach(sensors, async sensor => {
      const generatedSensorData = randomizeSensorValue(sensor);
      const genBatteryCharge = get(generatedSensorData, 'batteryCharge');
      const isOpen = get(generatedSensorData, 'isOpen');
      const isBroken = get(generatedSensorData, 'isBroken');

      // if successefylly connect with sensor and sensor does`t detect alarm
      if (genBatteryCharge && !isBroken && !isOpen && sensor.status === 'ok') {
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
        }
      }
    });
    return null;
  } catch (error) {
    console.info(error);
    return null;
  }
}
