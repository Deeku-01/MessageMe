import express from "express"; 
import jwt from "jsonwebtoken";
import User from "../Models/User";

export const protectedRoute= async (req: express.Request, res: express.Response, next: express.NextFunction):Promise<void> => {
    try {
        const token = req.cookies.jwtToken; // Get the JWT from cookies
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return ;
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        if (!decoded || !decoded.userId) {
            res.status(401).json({ message: "Invalid token" });
            return 
        }

        // Find the user by ID
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the user object
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        // Attach user to request object
        // @ts-ignore
        req.user= user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
        return 
    }
}