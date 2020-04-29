import cron from 'cron';
import forEach from 'lodash/forEach';

import survaySensors from './sensorsSurvey';
import sensorAlarmGenerator from './sensorAlarmGenerator';
import notableEventsService from '../services/NotableEventService';

const { CronJob } = cron;

const TIME_ZONE = 'Europe/Kiev';

const surveySensorsCron = new CronJob({
  cronTime: '30 * * * *',
  onTick: () => survaySensors(),
  timeZone: TIME_ZONE,
});

const deleteOldSensorsEventsCron = new CronJob({
  cronTime: '0 0 * * *',
  onTick: () => notableEventsService.deleteOlder30DaysEvents(),
  timeZone: TIME_ZONE,
});

const generateAlarmCron = new CronJob({
  cronTime: '*/3 * * * *',
  onTick: () => sensorAlarmGenerator(),
  timeZone: TIME_ZONE,
});

const crons = [
  generateAlarmCron,
  surveySensorsCron,
  deleteOldSensorsEventsCron,
];

export default function startCrons() {
  forEach(crons, cronJob => cronJob.start());
}
