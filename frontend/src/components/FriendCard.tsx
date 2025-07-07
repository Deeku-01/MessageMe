import { Link } from "react-router";


const FriendCard = ({ _id, profilePicture, fullName }:any) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src={profilePicture} 
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold truncate text-gray-900 dark:text-white">{fullName}</h3>
        </div>

        <Link 
          to={`/chat/${_id}`} 
          className="block w-full text-center px-4 py-2 border border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors font-medium"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;