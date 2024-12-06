import express from 'express';
import {
  getAllStaff,
  getStaff,
  modifyStaff,
  getAllRole,
  getAllSupplier,
  getSupplier,
  createSupplier,
  modifySupplier,
} from '../controllers/adminController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

// Staff
router.get('/staffs/:uid', authorizedUser, restrictAccess, getAllStaff);
router.get('/staffs/:uid/:sid', authorizedUser, restrictAccess, getStaff);
router.patch('/staffs/:uid/:sid', authorizedUser, restrictAccess, modifyStaff);

// Role
router.get('/roles/:uid', authorizedUser, restrictAccess, getAllRole);

// Supplier
router.post('/supplier/:uid', authorizedUser, restrictAccess, createSupplier);
router.get('/supplier/:uid', authorizedUser, restrictAccess, getAllSupplier);
router.get('/supplier/:uid/:supid', authorizedUser, restrictAccess, getSupplier);
router.patch('/supplier/:uid/:supid', authorizedUser, restrictAccess, modifySupplier);

export default router;
