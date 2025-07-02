import { User } from 'stream-chat';
export declare const upsertStreamUser: (userData: User) => Promise<import("stream-chat").APIResponse & {
    users: {
        [key: string]: import("stream-chat").UserResponse<import("stream-chat").DefaultGenerics>;
    };
}>;
export declare const generateStreamToken: (userId: string) => string;
//# sourceMappingURL=stream.d.ts.map