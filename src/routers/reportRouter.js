import express from 'express';
import {
  getBankTransactionRouterInfo,
  getStaffInfo,
  getExpenditureInfo,
  getReturnInfo,
  getStockInfo,
  getCustomerInfo,
  getCustomerReturnInfo,
  getSaleInfo,
  getTransactionInfo,
  getDailySaleInfo,
} from '../controllers/reportController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.get('/banktransaction-info/:uid', authorizedUser, restrictAccess, getBankTransactionRouterInfo);
router.get('/customer-info/:uid', authorizedUser, restrictAccess, getCustomerInfo);
router.get('/customer-return/:uid', authorizedUser, restrictAccess, getCustomerReturnInfo);
router.get('/dailySale-info/:uid',  authorizedUser, restrictAccess, getDailySaleInfo);
router.get('/expenditure-info/:uid', authorizedUser, restrictAccess, getExpenditureInfo);
router.get('/sale-info/:uid', authorizedUser, restrictAccess, getSaleInfo);
router.get('/staff-info/:uid', authorizedUser, restrictAccess, getStaffInfo);
router.get('/return-info/:uid', authorizedUser, restrictAccess, getReturnInfo);
router.get('/stock-info/:uid', authorizedUser, restrictAccess, getStockInfo);
router.get('/transaction-info/:uid', authorizedUser, restrictAccess, getTransactionInfo);

export default router;
