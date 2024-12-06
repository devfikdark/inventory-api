import express from 'express';
import {
  createRegularReturn,
  getAllRegularReturn,
} from '../controllers/returnController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.get('/list/:uid', authorizedUser, restrictAccess, getAllRegularReturn);
router.post('/:uid', authorizedUser, restrictAccess, createRegularReturn);

export default router;
