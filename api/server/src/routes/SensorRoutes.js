import { Router } from 'express';
import SensorCoonroller from '../controllers/SensorController';

const router = Router();

router
  .route('/')
  .get(SensorCoonroller.getAllSensors)
  .post(SensorCoonroller.addSensor);

router.route('/complete/:id').get(SensorCoonroller.getACompleteSensorInfo);

router
  .route('/:id')
  .get(SensorCoonroller.getASensor)
  .put(SensorCoonroller.updatedSensor)
  .delete(SensorCoonroller.deleteSensor);

export default router;
