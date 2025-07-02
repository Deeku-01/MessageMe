import { Document, Model, ObjectId } from "mongoose";
export interface IUser extends Document {
    _id: ObjectId;
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
    matchedPassword(candidatePassword: string): Promise<boolean>;
}
export interface IUserModel extends Model<IUser> {
}
declare const User: IUserModel;
export default User;
//# sourceMappingURL=User.d.ts.map