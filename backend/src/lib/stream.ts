import {StreamChat, User} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in .env file");
}

const streamclient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser= async (userData:User) => {
    try {
        // Create a new user in Stream
        const response = await streamclient.upsertUsers([userData]);
        return response;
    } catch (error) {
        console.error("Error creating Stream user:", error);
        throw error;
    }
}


export const generateStreamToken = (userId: string) => {
    try {
        // Generate a token for the user
        const token = streamclient.createToken(userId);
        return token;
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw error;
    }
}
