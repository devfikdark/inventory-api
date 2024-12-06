import express from 'express';
import {
  getInfo,
} from '../controllers/dashboardController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.get('/:uid', authorizedUser, restrictAccess, getInfo);

export default router;
