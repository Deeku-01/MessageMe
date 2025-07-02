"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Fixed: was "Minlength" (capital M)
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        default: "Hey there! I am using MessageMe",
    },
    profilePicture: {
        type: String,
        default: "https://www.gravatar.com/avatar/"
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
}, { timestamps: true });
// Prehook to hash password before saving
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            const salt = await bcryptjs_1.default.genSalt(10); // Generate a salt with 10 rounds
            this.password = await bcryptjs_1.default.hash(this.password, salt);
        }
        next(); // Move next() inside try block for successful execution
    }
    catch (error) {
        console.error("Error hashing password:", error);
        next(error); // Pass error to next() to stop the save operation
    }
});
// Instance method to compare passwords
userSchema.methods.matchedPassword = async function (candidatePassword) {
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
};
// Create and export the User model with proper typing
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map