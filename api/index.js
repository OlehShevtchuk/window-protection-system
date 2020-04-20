import config from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import windowRoutes from './server/src/routes/WindowRoutes';
import zoneRoutes from './server/src/routes/ZoneRoutes';
import sensorRoutes from './server/src/routes/SensorRoutes';
import modeRoutes from './server/src/routes/ModeRoutes';
import issueRoutes from './server/src/routes/IssueRoutes';
import housePlanRoutes from './server/src/routes/HousePlanRoutes';

import errorHandler from './server/src/helpers/errorHandler';
import auth from './server/src/helpers/auth';

import startCrons from './server/src/helpers/cron';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  fileUpload({
    useTempFiles: true,
    createParentPath: true,
  }),
);

app.use(cors());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

const port = process.env.PORT || 8000;

app.use(auth);

app.use('/api/window', windowRoutes);
app.use('/api/zone', zoneRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/mode', modeRoutes);
app.use('/api/issue', issueRoutes);
app.use('/api/house-plan', housePlanRoutes);

// when a random route is inputed
app.get('*', (request, response) =>
  response.status(200).send({
    message: 'Welcome to this API.',
  }),
);

app.use(errorHandler);

app.listen(port, () => {
  startCrons();
  console.log(`Server is running on PORT ${port}`);
});

export default app;
