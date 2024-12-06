import express from 'express';
import {
  createExpenditurePurpose,
  getExpenditurePurpose,
  modifyExpenditurePurpose,
  createExpenditure,
  getAllExpenditure,
  getExpenditure,
  modifyExpenditure,
} from '../controllers/expenditureController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/purpose/:uid', authorizedUser, restrictAccess, createExpenditurePurpose);
router.get('/purpose/:uid', authorizedUser, restrictAccess, getExpenditurePurpose);
router.patch('/purpose/:uid/:pid', authorizedUser, restrictAccess, modifyExpenditurePurpose);
router.post('/:uid', authorizedUser, restrictAccess, createExpenditure);
router.get('/:uid', authorizedUser, restrictAccess, getAllExpenditure);
router.get('/:uid/:eid', authorizedUser, restrictAccess, getExpenditure);
router.patch('/:uid/:eid', authorizedUser, restrictAccess, modifyExpenditure);

export default router;
