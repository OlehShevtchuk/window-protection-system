import cron from 'cron';
import forEach from 'lodash/forEach';

// import survaySensors from './sensorsSurvey';
import sensorAlarmGenerator from './sensorAlarmGenerator';

const { CronJob } = cron;

const TIME_ZONE = 'Europe/Kiev';

// const surveySensorsCron = new CronJob({
//   cronTime: '36 * * * *',
//   onTick: () => survaySensors(),
//   timeZone: TIME_ZONE,
// });

const generateAlarmCron = new CronJob({
  cronTime: '*/1 * * * *',
  onTick: () => sensorAlarmGenerator(),
  timeZone: TIME_ZONE,
});

const crons = [ generateAlarmCron];

export default function startCrons() {
  forEach(crons, cronJob => cronJob.start());
}
