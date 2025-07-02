
import express from 'express';
import { signupController,loginController,logoutController, onboard } from '../controllers/authController';

const router=express.Router();;

router.post("/signup",signupController)
router.post("/login",loginController)
router.post("/logout",logoutController)
router.post("/onboard", onboard)


export default router;