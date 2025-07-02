import { IUser } from "../Models/User";
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export {};
//# sourceMappingURL=index.d.ts.map