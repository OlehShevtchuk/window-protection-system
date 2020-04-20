import { Router } from 'express';
import HousePlanCoonroller from '../controllers/HousePlanController'

const router = Router();

router.route('/')
.get(HousePlanCoonroller. getPlan)
.post(HousePlanCoonroller.upload);

export default router;
