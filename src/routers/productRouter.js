import express from 'express';
import {
  createProduct,
  getAllProduct,
  getProduct,
  modifyProduct,
} from '../controllers/productController';
import authorizedUser from '../middlewares/auth/authorizedUser';
import restrictAccess from '../middlewares/accessLayer/restrictAccess';

const router = express.Router();

router.post('/:uid', authorizedUser, restrictAccess, createProduct);
router.get('/:uid', authorizedUser, restrictAccess, getAllProduct);
router.get('/:uid/:pid', authorizedUser, restrictAccess, getProduct);
router.patch('/:uid/:pid', authorizedUser, restrictAccess, modifyProduct);

export default router;
