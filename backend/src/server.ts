import express from 'express';
import cors from 'cors';
import authrouter from './routes/auth';
import { connectDB } from './lib/db';

const app= express();
app.use(express.json());
app.use(cors({}));


app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/api/auth", authrouter);

const PORT=process.env.PORT || 5001;

app.listen(PORT,async()=>{
    await connectDB();
    console.log("Database connected successfully");
    console.log(`Server is running on port http://localhost:${PORT}`);
    
});