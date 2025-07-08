import { Link } from "react-router";
import { capitalise } from "../constants/Capitalise";

const FriendCard = ({ _id, profilePicture, fullName }: any) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full">
              <img 
                src={profilePicture} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h3 className="font-semibold truncate">{capitalise(fullName)}</h3>
        </div>

        <Link 
          to={`/chat/${_id}`} 
          className="btn btn-primary btn-sm w-full"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;