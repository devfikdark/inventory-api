import express from 'express';
import {
  createBankTransaction,
  getAllBankTransaction,
  getBankTransaction,
} from '../controllers/bankTransactionController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createBankTransaction);
router.get('/:uid', authorizedUser, restrictAccess, getAllBankTransaction);
router.get('/:uid/:bid', authorizedUser, restrictAccess, getBankTransaction);

export default router;
