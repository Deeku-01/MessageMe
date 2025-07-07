import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router";
import { CheckCircleIcon, LoaderCircleIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import NoFriendsFound from "../components/NoFriendsFound";

import FriendCard from "../components/FriendCard";
import type { User } from "../types/types";
import toast from "react-hot-toast";
import { capitalise } from "../constants/Capitalise";

const HomePage = () => {
  const queryClient=useQueryClient();
  const [outgoingRequestsIDS,setoutgoingRequestsIDS]=useState(new Set());



  const {data:friends,isLoading:friendsLoader}=useQuery({
    queryKey:["friends"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/api/user/friends")
      return res.data;

    }
  })

  const {data:recomdUsers,isLoading:recomdUsersLoader}=useQuery({
    queryKey:["recomdUsers"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/api/user")
      return res.data;
    }
  })

   const {data:outgoingFrndReqs}=useQuery({
    queryKey:["OutgoingFrndReqs"],
    queryFn:async()=>{
      const res=await axiosInstance.get("/api/user/friendreqs")
      return res.data.outgoingReq;
    }

  })


  const {mutate:sendReqsMutation,isPending}=useMutation({
    mutationFn: async(userID:string)=>{
      const res=await axiosInstance.post(`/api/user/friendreq/${userID}`)
      return res.data;
    },
    onSuccess:()=>{
       queryClient.invalidateQueries({queryKey:["OutgoingFrndReqs"]})
       toast.success("Sending Request !!");

    }
  })

  useEffect(()=>{
    const outgngIds=new Set();
    if(outgoingFrndReqs && outgoingFrndReqs.length>0){
        outgoingFrndReqs.forEach((req:any) => {
          outgngIds.add(req.recipient._id)
        });
        setoutgoingRequestsIDS(outgngIds);
    }

  },[outgoingFrndReqs])



  return (
    <div >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto space-y-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              <Link to="/notifications" className="btn btn-outline btn-sm">
                <UsersIcon className="mr-2 size-4" />
                Friend Requests
              </Link>
            </div>

            {friendsLoader ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : friends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {friends.map((friend:any) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
            <section>
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New People</h2>
                    <p className="opacity-70">
                      Communicate with Anyone
                    </p>
                  </div>
                </div>
              </div>

              {recomdUsersLoader ? (
                <LoaderCircleIcon></LoaderCircleIcon>
              ):(recomdUsers.length===0 ?(
                <div className="card bg-base-200 p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                  <p className="text-base-content opacity-70">
                    Check back later for new partners!
                  </p>
                </div>
              ):(
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recomdUsers.map((user:User)=>{
                      const hasrequestbeensent=outgoingRequestsIDS.has(user._id)

                      return (
                        <div
                          key={user._id}
                          className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="card-body p-5 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="avatar size-16 rounded-full">
                                  <img src={user.profilePicture} alt={user.fullName} />
                                </div>

                                <div>
                                  <h3 className="font-semibold text-lg">{capitalise(user.fullName)}</h3>
                                </div>
                            </div>  
                                {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                                 {/* Action button */}
                                <button
                                  className={`btn w-full mt-2 ${
                                    hasrequestbeensent ? "btn-disabled" : "btn-primary"
                                  } `}
                                  onClick={() => sendReqsMutation(user._id)}
                                  disabled={hasrequestbeensent || isPending}
                                >
                                    {hasrequestbeensent ? (
                                      <>
                                        <CheckCircleIcon className="size-4 mr-2" />
                                        Request Sent
                                      </>
                                    ) : (
                                      <>
                                        <UserPlusIcon className="size-4 mr-2" />
                                        Send Friend Request
                                      </>
                                     )}
                                </button>


                            </div>
                        </div>
                      )
                  })}

                  
                </div>
              ))}
            </section>
        </div>
      </div>
      
    </div>
  )
}

export default HomePage

