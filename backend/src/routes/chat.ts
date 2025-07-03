import express from 'express';
import { getStreamToken } from '../controllers/chatController';


const router = express.Router();

router.get("/token",getStreamToken);


export default router;
