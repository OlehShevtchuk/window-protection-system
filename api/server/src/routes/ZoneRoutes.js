import { Router } from 'express';
import ZoneCoonroller from '../controllers/ZoneController';

const router = Router();

router
  .route('/')
  .get(ZoneCoonroller.getAllZones)
  .post(ZoneCoonroller.addZone);

router
  .route('/:id')
  .get(ZoneCoonroller.getAZone)
  .put(ZoneCoonroller.updatedZone)
  .delete(ZoneCoonroller.deleteZone);

export default router;
