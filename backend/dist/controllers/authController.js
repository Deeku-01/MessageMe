"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
exports.loginController = loginController;
exports.logoutController = logoutController;
const zod_1 = __importDefault(require("zod"));
const User_1 = __importDefault(require("../Models/User")); // Adjust the import path as necessary
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupSchema = zod_1.default.object({
    fullName: zod_1.default.string().min(1, "Full name is required"),
    username: zod_1.default.string().min(1, "Username is required"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters long"),
    email: zod_1.default.string().email("Invalid email address")
});
// @ts-ignore
function signupController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedData = signupSchema.parse(req.body);
            const { fullName, username, password, email } = validatedData;
            // Here you would typically save the user to the database
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email already exists in our system"
                });
            }
            const idx = Math.floor(Math.random() * 100) + 1;
            const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
            const newUser = yield User_1.default.create({
                fullName,
                username,
                password,
                email,
                profilePicture: randomAvatar
            });
            // TODO : Create the User in the Stream Chat service
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
                user: Object.assign(Object.assign({}, newUser), { password: undefined }), // Exclude password from the response
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
    });
}
// @ts-ignore
function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.send("Login Endpoint");
    });
}
// @ts-ignore
function logoutController(req, res) {
    res.send("Logout Endpoint");
}
