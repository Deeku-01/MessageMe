"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.onboard = onboard;
const zod_1 = __importDefault(require("zod"));
const User_1 = __importDefault(require("../Models/User")); // Adjust the import path as necessary
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stream_1 = require("../lib/stream");
const signupSchema = zod_1.default.object({
    fullName: zod_1.default.string().min(1, "Full name is required"),
    username: zod_1.default.string().min(1, "Username is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    email: zod_1.default.string().email("Invalid email address")
});
// @ts-ignore
async function signupController(req, res) {
    try {
        const validatedData = signupSchema.parse(req.body);
        const { fullName, username, password, email } = validatedData;
        // Here you would typically save the user to the database
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists in our system"
            });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User_1.default.create({
            fullName,
            username,
            password,
            email,
            profilePicture: randomAvatar
        });
        // Create the User in the Stream Chat service
        const StreamUser = await (0, stream_1.upsertStreamUser)({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePicture || "https://avatar.iran.liara.run/public/2.png"
        });
        console.log("Stream User created:", StreamUser);
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d" // Token expiration time
        });
        res.cookie("jwtToken", token, {
            sameSite: "strict", // Helps prevent CSRF attacks
            httpOnly: true, // Prevents client-side JavaScript(XSS) from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            message: "User created successfully",
            success: true,
            user: { ...newUser, password: undefined }, // Exclude password from the response
        });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        // Handle other errors
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
const loginSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email address"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long")
});
// @ts-ignore
async function loginController(req, res) {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        // Find the user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // Check if the password matches
        const isPasswordValid = await user.matchedPassword(password);
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.cookie("jwtToken", token, {
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(200).json({
            message: "Login successful",
            success: true,
            user: { ...user, password: undefined }, // Exclude password from the response
        });
    }
    catch (error) {
        console.log("error in Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// @ts-ignore
function logoutController(req, res) {
    res.clearCookie("jwtToken");
    res.status(200).json({
        message: "Logout successful",
        success: true
    });
}
// @ts-ignore
async function onboard(req, res) {
    try {
        const userID = req.user._id; // Assuming req.user is set by the protectedRoute middleware
        const user = await User_1.default.findById(userID);
        const { fullName, username, bio, profilePicture } = req.body;
        if (!fullName || !username || !bio || !profilePicture) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName ? "fullName" : null,
                    !username ? "username" : null,
                    !bio ? "bio" : null,
                    !profilePicture ? "profilePicture" : null
                ]
            });
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userID, { ...req.body, isOnboarded: true }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // TODO : Update the User Info In Stream Chat Service
        const StreamUser = await (0, stream_1.upsertStreamUser)({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePicture || "https://avatar.iran.liara.run/public/2.png"
        });
        res.status(200).json({
            message: "Onboarding completed successfully",
            success: true,
            user: updatedUser
        });
    }
    catch (err) {
        console.error("Error during onboarding:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
//# sourceMappingURL=authController.js.map