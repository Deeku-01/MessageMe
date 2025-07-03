import express from 'express';

import authrouter from './routes/auth';
import userrouter from './routes/user';
import chatroutes from './routes/chat';
import {protectedRoute} from './middleware/auth.middleware';

import cors from 'cors';
import { connectDB } from './lib/db';
import CookieParser from 'cookie-parser';

const app= express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true //allow frontend to send cookies
}));
app.use(CookieParser());




app.get("/",(req,res)=>{
    res.send("Hello World");
})
app.get("/me",protectedRoute,(req,res)=>{
    res.status(200).json({
        message: "Protected route accessed successfully",
        user: req.user // Assuming req.user is set by the protectedRoute middleware
    });
})

app.use("/api/auth", authrouter);
app.use("/api/user",protectedRoute, userrouter);
app.use("/api/chat",protectedRoute, chatroutes);


// Forget Password Route
// Notification Route

const PORT=process.env.PORT || 5001

app.listen(PORT,async()=>{
    await connectDB();
    console.log("Database connected successfully");
    console.log(`Server is running on port http://localhost:${PORT}`);
    
});