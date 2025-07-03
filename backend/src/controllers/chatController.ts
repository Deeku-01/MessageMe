import { generateStreamToken } from "../lib/stream";

export async function getStreamToken(req: any, res: any) {
    try {
        const userId = req.user._id; // Assuming req.user is populated with the authenticated user's info
        const token = generateStreamToken(userId.toString());
        
        res.status(200).json({ token }); // needed to open up the chat page and communicate through stream
    } catch (error) {
        console.error("Error generating Stream token:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error
        });
    }
}