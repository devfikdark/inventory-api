import express from 'express';
import {
  adminSignUp,
  adminSignIn,
  staffSignUp,
  staffSignIn,
  staffVerifyUserName,
  staffPasswordReplace,
  logOut,
} from '../controllers/authController';
import authorizedUser from '../middlewares/auth/authorizedUser';

const router = express.Router();

// Admin
// router.post('/admin-signup', adminSignUp);
router.post('/admin-signin', adminSignIn);

// Staff
router.post('/staff-signup', authorizedUser, staffSignUp);
router.post('/staff-signin', staffSignIn);

router.post('/staff-userName-verify', authorizedUser, staffVerifyUserName);
router.post('/staff-password-replace', authorizedUser, staffPasswordReplace);

router.get('/logout/:uid', authorizedUser, logOut);

export default router;
