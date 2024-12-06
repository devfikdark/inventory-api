import express from 'express';
import {
  createReturn,
  getAllReturn,
  getAllActiveReturn,
  getReturn,
  modifyReturn,
} from '../controllers/returnController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createReturn);
router.get('/:uid', authorizedUser, restrictAccess, getAllReturn);
router.get('/:uid/:oid/active', authorizedUser, restrictAccess, getAllActiveReturn);
router.get('/:uid/:rid', authorizedUser, restrictAccess, getReturn);
router.patch('/:uid/:rid', authorizedUser, restrictAccess, modifyReturn);

export default router;
