import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import windowRoutes from './server/src/routes/WindowRoutes';
import zoneRoutes from './server/src/routes/ZoneRoutes';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;
app.use('/api/window', windowRoutes);
app.use('/api/zone', zoneRoutes);

// when a random route is inputed
app.get('*', (request, response) =>
  response.status(200).send({
    message: 'Welcome to this API.',
  }),
);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
