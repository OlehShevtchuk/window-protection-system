import { Router } from 'express';
import IssueController from '../controllers/IssueController';

const router = Router();

router
  .route('/')
  .get(IssueController.getAllIssues)
  .post(IssueController.addIssue);

router
  .route('/:id')
  .put(IssueController.updatedIssue)
  .delete(IssueController.deleteIssue);

export default router;
