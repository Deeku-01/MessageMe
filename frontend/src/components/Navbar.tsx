import { Link, useLocation } from "react-router";
import { BellIcon, LogOutIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthuser";
import ThemeSelector from "./ThemeSelector";
import toast from "react-hot-toast";
import { LogoOption2 } from "./Logo";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("api/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Successfully Logged Out");
    }
  });

  const handlelogout = () => {
    logoutMutation();
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5">
                <LogoOption2/>
              </Link>
            </div>
          )}

          {/* Right side items */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePicture} alt="User Avatar" />
              </div>
            </div>

            {/* Logout button */}
            <button className="btn btn-ghost btn-circle" onClick={handlelogout}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
