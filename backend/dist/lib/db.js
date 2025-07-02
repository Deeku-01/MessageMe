"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Configure dotenv BEFORE using process.env
dotenv_1.default.config();
const connectDB = async () => {
    try {
        // Add debugging to check if DB_URI is loaded
        if (!process.env.DB_URI) {
            throw new Error("DB_URI environment variable is not set");
        }
        console.log("Attempting to connect to MongoDB...");
        const conn = await mongoose_1.default.connect(process.env.DB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1); // Exit the process with failure
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map