import express from 'express';
import {
  getAllCustomer,
  getCustomer,
  modifyCustomer,
} from '../controllers/customerController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.get('/:uid', authorizedUser, restrictAccess, getAllCustomer);
router.get('/:uid/:mobile', authorizedUser, getCustomer);
router.patch('/:uid/:mobile', authorizedUser, restrictAccess, modifyCustomer);

export default router;
