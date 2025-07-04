import mongoose, { Document, Model, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for the User document
export interface IUser extends Document {
  _id: ObjectId; // MongoDB ObjectId type
  email: string;
  password: string;
  fullName: string;
  username: string;
  bio: string;
  profilePicture: string;
  isOnboarded: boolean;
  friends: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  
  // Define the custom instance method
  matchedPassword(candidatePassword: string): Promise<boolean>;
}

// Define the interface for the User model
export interface IUserModel extends Model<IUser> {
  // Add any static methods here if needed
}

const userSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
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
    isOnboarded: { // Indicates if the user has completed the onboarding process
        type: Boolean,
        default: false,
    },
    friends: [{ // Array of user IDs representing friends
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

// Prehook to hash password before saving
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
            this.password = await bcrypt.hash(this.password, salt);
        }
        next(); // Move next() inside try block for successful execution
    } catch (error) {
        console.error("Error hashing password:", error);
        next(error as Error); // Pass error to next() to stop the save operation
    }
});

// Instance method to compare passwords
userSchema.methods.matchedPassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return false;
    }
};

// Create and export the User model with proper typing
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;