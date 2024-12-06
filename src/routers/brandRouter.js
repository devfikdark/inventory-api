import express from 'express';
import {
  createBrand,
  getAllBrand,
  getBrand,
  modifyBrand,
} from '../controllers/brandController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createBrand);
router.get('/:uid', authorizedUser, restrictAccess, getAllBrand);
// router.get('/:uid/:bid', authorizedUser, restrictAccess, getBrand);
router.patch('/:uid/:bid', authorizedUser, restrictAccess, modifyBrand);

export default router;
