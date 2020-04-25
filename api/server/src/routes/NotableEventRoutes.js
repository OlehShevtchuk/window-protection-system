import { Router } from 'express';
import NotableEventController from '../controllers/NotableEventController';

const router = Router();

router
  .route('/')
  .get(NotableEventController.getNotableEvents)

export default router;
