
import express from 'express';
import { signupController,loginController,logoutController, onboard } from '../controllers/authController';
import { protectedRoute } from '../middleware/auth.middleware';

const router=express.Router();;

router.post("/signup",signupController)
router.post("/login",loginController)
router.post("/logout",protectedRoute,logoutController)
router.post("/onboard",protectedRoute, onboard)


export default router;