import express from 'express';
import {
  createTransaction,
  getAllTransaction,
  getTransaction,
} from '../controllers/transactionController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createTransaction);
router.get('/:uid', authorizedUser, restrictAccess, getAllTransaction);
router.get('/:uid/:tid', authorizedUser, restrictAccess, getTransaction);
// router.patch('/:uid/:rid', authorizedUser, restrictAccess, modifyTransaction);

export default router;
