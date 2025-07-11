import {Router} from 'express';
import {register,login,logout,getProfile,forgotPassword,resetPassword,changePassword,updateUser} from '../controllers/user.controller.js';
const router = Router();
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';


router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/me',isLoggedIn,getProfile);
router.post('/reset',forgotPassword);
router.post('/reset/:resetToken',resetPassword);
router.post('/change-password',isLoggedIn,changePassword);
router.put('/update/:id',isLoggedIn,upload.single("avatar"),updateUser);

export default router;