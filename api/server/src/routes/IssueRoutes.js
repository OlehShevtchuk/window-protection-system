import { Router } from 'express';
import { IssueController, eventsSse } from '../controllers/IssueController';
import { sseHubMiddleware } from '../helpers/sseHub';

const router = Router();

router
  .route('/')
  .get(IssueController.getAllIssues)
  .post(IssueController.addIssue);

router
  .route('/:id')
  .put(IssueController.updatedIssue)
  .delete(IssueController.deleteIssue);

router.route('/events').get(sseHubMiddleware, eventsSse);

export default router;
