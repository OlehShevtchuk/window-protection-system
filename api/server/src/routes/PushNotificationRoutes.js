import { Router } from 'express';
import PushNotificationController from '../controllers/PushNotificationController';

const router = Router();

router
  .route('/subscribe')
  .post(PushNotificationController.subscribe);

router.route('/unsubscribe').post(PushNotificationController.unsubscribe);

router.route('/public-key').get(PushNotificationController.getPublicKey);

router.route('/push').post(PushNotificationController.push);

export default router;
