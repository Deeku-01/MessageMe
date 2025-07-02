import express from 'express';
import cors from 'cors';
import authrouter from './routes/auth';
import { connectDB } from './lib/db';
import {protectedRoute} from './middleware/auth.middleware';
import CookieParser from 'cookie-parser';

const app= express();
app.use(express.json());
app.use(cors({}));
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


const PORT=process.env.PORT || 5001

app.listen(PORT,async()=>{
    await connectDB();
    console.log("Database connected successfully");
    console.log(`Server is running on port http://localhost:${PORT}`);
    
});