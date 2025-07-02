"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../Models/User"));
const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken; // Get the JWT from cookies
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        // Find the user by ID
        const user = await User_1.default.findById(decoded.userId).select("-password"); // Exclude password from the user object
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Attach user to request object
        // @ts-ignore
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
exports.protectedRoute = protectedRoute;
//# sourceMappingURL=auth.middleware.js.map