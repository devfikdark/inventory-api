import express from 'express';
import {
  createSale,
  getAllSale,
  getSale,
  modifySale,
  archiveSale,
} from '../controllers/saleController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createSale);
router.get('/:uid', authorizedUser, restrictAccess, getAllSale);
router.get('/:uid/:sid', authorizedUser, restrictAccess, getSale);
router.patch('/:uid/:sid', authorizedUser, restrictAccess, modifySale);
router.post('/:uid/:sid/archive', authorizedUser, restrictAccess, archiveSale);

export default router;
