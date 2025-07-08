import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, XIcon } from "lucide-react";
import { capitalise } from "../constants/Capitalise";
import NoNotificationsFound from "../components/NoNotificationsFound";
import type { FriendRequest} from "../types/types";
import { useNavigate } from "react-router";

const NoticationsPage = () => {
  const queryClient=useQueryClient();

  const {data:friendReqs,isLoading}=useQuery({
    queryKey:["friendReqs"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/api/user/friendreqs");
      return res.data;
    }
  })

  const {mutate:acceptReqMutation,isPending:isAccepting}=useMutation({
    mutationFn: async(userId:string)=>{
      const res= await axiosInstance.put(`/api/user/friendaccept/${userId}`)
      return res.data;
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["friendReqs"]}) //move from friend reqs=> New connections
      queryClient.invalidateQueries({queryKey:["friends"]}) //once accepted it should imediately reflect in homepage
      toast.success("You are Now Friends");
    }
  })

    const {mutate:rejectReqMutation,isPending:isRejecting}=useMutation({
    mutationFn: async(userId:string)=>{
      const res= await axiosInstance.put(`/api/user/friendreject/${userId}`)
      return res.data;
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["friendReqs"]}) //remove from friend reqs list
      toast.success("Friend request rejected");
    },
    onError: ()=>{
      toast.error("Failed to reject friend request");
    }
  })

  const navigate=useNavigate();

  const onclickhandler=(id:string)=>{
    navigate(`/chat/${id}`)
  }

  const incomingReqs=friendReqs?.incommingReq || [];
  const acceptedReq=friendReqs?.acceptedReq || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingReqs.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingReqs.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingReqs.map((request:FriendRequest) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePicture} alt={request.sender.fullName} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                            </div>
                          </div>

                           <div className="flex gap-2">
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => rejectReqMutation(request._id)}
                              disabled={isRejecting || isAccepting}
                            >
                              <XIcon className="h-4 w-4" />
                              Reject
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptReqMutation(request._id)}
                              disabled={isAccepting || isRejecting}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedReq.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedReq.map((notification:FriendRequest) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.sender.profilePicture}
                              alt={notification.sender.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{capitalise(notification.sender.fullName)}</h3>
                            <p className="text-sm my-1">
                              You accepted {capitalise(notification.sender.fullName)} friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div 
                            className="badge badge-primary mt-2 mb-2 cursor-pointer hover:badge-primary-focus" 
                            onClick={() => onclickhandler(notification.sender._id)}
                          >
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            Message
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingReqs.length === 0 && acceptedReq.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NoticationsPage
