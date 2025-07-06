import express from "express";
import { 
    acceptFriendRequest, 
    getFriendReqs, 
    getMyfriends,
    getRecommendedUsers, 
    sendFriendRequest,
    rejectFriendRequest,
    removeFriend
} from "../controllers/userController";

const router = express.Router();

// Get recommended users
router.get("/", getRecommendedUsers); 

// Get user's friends
router.get("/friends", getMyfriends);

// Send friend request
router.post("/friendreq/:id", sendFriendRequest); 

// Accept friend request
router.put("/friendaccept/:id", acceptFriendRequest); 

// Reject friend request (ADDED)
router.put("/friendreject/:id", rejectFriendRequest);

// Remove friend (ADDED)
router.delete("/friend/:id", removeFriend);

// Get friend requests (gets incommingReq, acceptedReq, outgoingReq)
router.get("/friendreqs", getFriendReqs);

export default router;