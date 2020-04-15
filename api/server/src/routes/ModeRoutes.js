import { Router } from 'express';
import ModeCoonroller from '../controllers/ModeController';

const router = Router();

router.route('/').post(ModeCoonroller.addMode);

router
  .route('/main-mode')
  .get(ModeCoonroller.getMainMode)
  .put(ModeCoonroller.setMainModeStatus);

router
  .route('/:id')
  .get(ModeCoonroller.getAMode)
  .put(ModeCoonroller.updatedModeStatus)

export default router;
