export interface User {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  bio: string;
  profilePicture: string;
  isOnboarded: boolean;
  friends: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendCardProps extends User {
  friend: User;
  onMessage: (friendId: string) => void;
  onRemoveFriend: (friendId: string) => void;
  isRemovingFriend?: boolean;
}


export interface FriendRequest {
  _id: string;
  sender: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
export interface ProfileCard {
  _id: string;
  fullName: string;
  profilePicture: string;
  bio?: string;
  // Add any other properties you actually use
}
