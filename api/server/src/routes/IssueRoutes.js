import { Router } from 'express';
import { IssueController, eventsSse } from '../controllers/IssueController';

const router = Router();

router
  .route('/')
  .get(IssueController.getAllIssues)
  .post(IssueController.addIssue);

router
  .route('/:id')
  .put(IssueController.updatedIssue)
  .delete(IssueController.deleteIssue);

router.route('/events').get(eventsSse);

export default router;
