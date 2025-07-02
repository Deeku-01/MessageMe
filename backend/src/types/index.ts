import { IUser } from "../Models/User"; // Adjust the import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or whatever type your user object should be
      // Add other custom properties if needed
    }
  }
}

export {};