import { Users } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No friends yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Start connecting with other learners to build your network!
      </p>
    </div>
  );
};

export default NoFriendsFound;