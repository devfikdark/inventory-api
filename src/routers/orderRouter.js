import express from 'express';
import {
  createOrder,
  getAllOrder,
  getOrder,
  modifyOrder,
  getOPInfo,
} from '../controllers/orderController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createOrder);
router.get('/:uid', authorizedUser, restrictAccess, getAllOrder);
router.get('/:uid/:oid', authorizedUser, restrictAccess, getOrder);
router.patch('/:uid/:oid', authorizedUser, restrictAccess, modifyOrder);
router.get('/op/:uid/:opid', authorizedUser, restrictAccess, getOPInfo);

export default router;
