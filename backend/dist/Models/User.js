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
        Minlength: 6,
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
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                const salt = yield bcryptjs_1.default.genSalt(10); // Generate a salt with 10 rounds
                this.password = yield bcryptjs_1.default.hash(this.password, salt);
            }
        }
        catch (error) {
            console.error("Error hashing password:", error);
        }
        finally {
            next();
        }
    });
});
// After hook to log user creation
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
