import express from 'express';
import {
  createSize,
  getAllSize,
  getSize,
  modifySize,
} from '../controllers/sizeController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createSize);
router.get('/:uid', authorizedUser, restrictAccess, getAllSize);
// router.get('/:uid/:sid', authorizedUser, restrictAccess, getSize);
router.patch('/:uid/:sid', authorizedUser, restrictAccess, modifySize);

export default router;
