"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStreamToken = exports.upsertStreamUser = void 0;
const stream_chat_1 = require("stream-chat");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in .env file");
}
const streamclient = stream_chat_1.StreamChat.getInstance(apiKey, apiSecret);
const upsertStreamUser = async (userData) => {
    try {
        // Create a new user in Stream
        const response = await streamclient.upsertUsers([userData]);
        return response;
    }
    catch (error) {
        console.error("Error creating Stream user:", error);
        throw error;
    }
};
exports.upsertStreamUser = upsertStreamUser;
const generateStreamToken = (userId) => {
    try {
        // Generate a token for the user
        const token = streamclient.createToken(userId);
        return token;
    }
    catch (error) {
        console.error("Error generating Stream token:", error);
        throw error;
    }
};
exports.generateStreamToken = generateStreamToken;
//# sourceMappingURL=stream.js.map