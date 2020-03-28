import { Router } from 'express';
import WindowController from '../controllers/WindowController';

const router = Router();

router.route('/')
    .get(WindowController.getAllWindows)
    .post(WindowController.addWindow);

router.route('/:id')
    .get(WindowController.getAWindow)
    .put(WindowController.updatedWindow)
    .delete(WindowController.deleteWindow);

export default router;