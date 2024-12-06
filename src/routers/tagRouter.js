import express from 'express';
import {
  createTag,
  getAllTag,
  getTag,
  modifyTag,
} from '../controllers/tagController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createTag);
router.get('/:uid', authorizedUser, restrictAccess, getAllTag);
// router.get('/:uid/:tid', authorizedUser, restrictAccess, getTag);
router.patch('/:uid/:tid', authorizedUser, restrictAccess, modifyTag);

export default router;
