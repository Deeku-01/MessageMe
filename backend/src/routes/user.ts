import express from "express";
import { acceptFriendRequest, getFriendReqs, getMyfriends,getRecommendedUsers, sendFriendRequest } from "../controllers/userController";

const router = express.Router();

router.get("/", getRecommendedUsers); 
router.get("/friends", getMyfriends);

router.post("/friendreq/:id", sendFriendRequest); 
router.put("/friendaccept/:id", acceptFriendRequest); 

router.get("/friendreqs",getFriendReqs)  // gets  incommingReq,acceptedReq,outgoingReq


// Reject friend Requests Route


export default router
