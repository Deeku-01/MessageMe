
import mongoose from "mongoose";
import dotenv from "dotenv";

// Configure dotenv BEFORE using process.env
dotenv.config();

export const connectDB = async () => {
  try {
    // Add debugging to check if DB_URI is loaded
    if (!process.env.DB_URI) {
      throw new Error("DB_URI environment variable is not set");
    }
    
    console.log("Attempting to connect to MongoDB...");
    
    const conn = await mongoose.connect(process.env.DB_URI as string);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1); // Exit the process with failure
  }
};