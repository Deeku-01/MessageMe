import FriendRequest from '../lib/FriendReq';
import User from '../Models/User'; // Adjust the import based on your project structure

export async function getRecommendedUsers(req: any, res: any) {
    try {
        const curUserId = req.user._id; // Assuming req.user is set by the protectedRoute middleware
        const curUser = req.user;
        
        // Assuming you have a User model to interact with the database
        const recommendedusers = await User.find({ 
            $and: [
                { _id: { $ne: curUserId } },
                { _id: { $nin: curUser.friends } },
                { isOnboarded: true } // Exclude friends
            ]
        }) // Exclude the current user
            .select('-password -__v'); // Exclude sensitive fields

        res.status(200).json(recommendedusers);
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export async function getMyfriends(req: any, res: any) {
    try {
        const curUserId = req.user._id; // Assuming req.user is set by the protectedRoute middleware
        
        // Assuming you have a User model to interact with the database
        const user = await User.findById(curUserId).select("friends")
            .populate('friends', "fullName profilePicture"); // FIXED: Changed to profilePicture

        res.status(200).json(user?.friends || []);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export async function sendFriendRequest(req: any, res: any) {
    try {
        const senderId = req.user._id; // Assuming req.user is set by the protectedRoute middleware
        const recipientId = req.params.id; // FIXED: Get recipient ID from request parameters

        // Check if sender and recipient are the same
        if (senderId.toString() === recipientId.toString()) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself."
            });
        }

        // Find the recipient user
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                message: "Recipient user not found."
            });
        }

        if (recipient.friends.includes(senderId)) {
            return res.status(400).json({
                message: "You are already friends with this user."
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ],
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Friend request already sent."
            });
        }

        const friendReq = await FriendRequest.create({
            sender: senderId,
            recipient: recipientId,
            status: "pending"
        });

        res.status(200).json(friendReq);

    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export async function acceptFriendRequest(req: any, res: any) {
    try {
        const userId = req.user._id; // Assuming req.user is set by the protectedRoute middleware
        const requestId = req.params.id; // FIXED: Get request ID from request parameters

        // Find the friend request
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({
                message: "Friend request not found."
            });
        }

        // Check if the current user is the recipient of the friend request
        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this friend request."
            });
        }

        // Update the friend request status to accepted
        friendRequest.status = "accepted";
        await friendRequest.save(); 

        // Add each other to friends list
        // $addToSet ensures that the user is added only if they are not already in the array
        const senderId = friendRequest.sender;
        await User.findByIdAndUpdate(userId, { $addToSet: { friends: senderId } });
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: userId } });

        res.status(200).json(friendRequest);
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

export async function getFriendReqs(req: any, res: any) {
    try {
        const incommingReq = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate('sender', 'fullName profilePicture'); // FIXED: Changed to profilePicture

        const acceptedReq = await FriendRequest.find({
            $or: [
                { sender: req.user._id, status: "accepted" },
                { recipient: req.user._id, status: "accepted" }
            ]
        }).populate('sender recipient', 'fullName profilePicture'); // FIXED: Changed to profilePicture

        const outgoingReq = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        }).populate('recipient', 'fullName profilePicture'); // FIXED: Changed to profilePicture

        res.status(200).json({
            incommingReq,
            acceptedReq,
            outgoingReq
        });

    } catch (err) {
        console.error("Error fetching friend requests:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

// ADDED: Missing rejectFriendRequest function
export async function rejectFriendRequest(req: any, res: any) {
    try {
        const userId = req.user._id;
        const requestId = req.params.id;

        // Find the friend request
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({
                message: "Friend request not found."
            });
        }

        // Check if the current user is the recipient of the friend request
        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to reject this friend request."
            });
        }

        // Update the friend request status to rejected
        friendRequest.status = "rejected";
        await friendRequest.save();

        res.status(200).json(friendRequest);
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}

// ADDED: Missing removeFriend function
export async function removeFriend(req: any, res: any) {
    try {
        const userId = req.user._id;
        const friendId = req.params.id;

        // Remove from both users' friends lists
        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

        // Update any accepted friend requests between these users
        await FriendRequest.updateMany({
            $or: [
                { sender: userId, recipient: friendId },
                { sender: friendId, recipient: userId }
            ],
            status: "accepted"
        }, { status: "removed" });

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        console.error("Error removing friend:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}