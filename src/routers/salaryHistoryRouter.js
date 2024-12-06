import express from 'express';
import {
  createSalaryHistory,
  getAllSalaryHistory,
  getSalaryHistory,
  modifySalaryHistory,
} from '../controllers/salaryHistoryController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createSalaryHistory);
router.get('/:uid', authorizedUser, restrictAccess, getAllSalaryHistory);
router.get('/:uid/:sid', authorizedUser, restrictAccess, getSalaryHistory);
// router.patch('/:uid/:sid', authorizedUser, restrictAccess, modifySalaryHistory);

export default router;
