import { useState } from "react";
import useAuthUser from "../hooks/useAuthuser"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { CameraIcon, Podcast, ShuffleIcon } from "lucide-react";


const OnboardingPage = () => {
  const {authUser}=useAuthUser();
  const queryClient=useQueryClient();

  const[isGeneratingAvatar,setGeneratingAvatar]=useState(false);
  const [formState,setformState]=useState({
    fullName:authUser?.fullName || "",
    bio:authUser?.bio || "",
    username:authUser?.username || "",
    profilePicture:authUser?.profilePicture || "", 
  })


  const{mutate:onboardingMutation ,isPending}=useMutation({
    mutationFn: async ()=>{
      const res= await axiosInstance.post("/api/auth/onboard",formState)
      return res.data;
    },
     onSuccess:()=>{
      toast.success("Profile Onboarded Successfully");
      queryClient.invalidateQueries({queryKey:["authUser"]})
     },
     onError: (error: any) => {
      toast.error(error.response?.data?.message)
    },
  })

  const generateRandomAvatar= async ()=>{ 
     const idx=Math.floor(Math.random() * 100)+1;
     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setformState(prev=> ({
      ...prev,
      profilePicture:randomAvatar
     }))
     return await new Promise(resolve => setTimeout(resolve, 700))

  }

  const handleRandomAvatar = async () => {
      setGeneratingAvatar(true);

    await toast.promise(
    generateRandomAvatar(),
    {
      loading: 'Generating...',
      success: <b>generated</b>,
      error: <b>Could not Generate.</b>,
    }
  );
      setGeneratingAvatar(false);
};

  const handleSumbit= (e:any)=>{
    e.preventDefault();  //prevents reloading behaviour of the page once form is sumbitted 
    onboardingMutation();
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setformState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 " data-theme="black">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6"> Complete Your Profile</h1>
            <form onSubmit={handleSumbit} className="space-y-6">
              {/* Profile Pic Container */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Image Preview */}
                  <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                     {isGeneratingAvatar ? (
                        // Loading state in place of image
                        <div className="flex items-center justify-center h-full">
                          <span className="loading loading-spinner loading-md text-accent"></span>
                        </div>
                      ) :formState.profilePicture ? (
                          <img 
                            src={formState.profilePicture}
                            alt="Profile Prieview"
                            className="w-full h-full object-cover"
                          />):(
                            <div className="flex items-center justify-center h-full">
                                <CameraIcon className="size-12 text-base-content opacity-400 "/>
                            </div> 
                          )
                        }
                  </div>
                  {/* Generate Random Avatar Button */}
                  <div className="flex items-center gap-2">
                    <button className="btn btn-accent rounded-full" onClick={handleRandomAvatar} type="button" disabled={isGeneratingAvatar}>
                      <ShuffleIcon className="size-4 mr-2"/> {isGeneratingAvatar ? 'Generating...' : 'Generate Random Avatar'}
                    </button>
                  </div>
                </div>
               {/* Form Fields */}
                <div className="space-y-4">
                  {/* Username Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Username</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  {/* Full Name Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  {/* Bio Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <textarea
                      name="bio"
                      onChange={handleInputChange}
                      placeholder={formState.bio}
                      className="textarea textarea-bordered w-full h-24 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto px-8 rounded-xl"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Updating Profile...
                      </>
                    ) : (
                      <span className="flex col-span-2 space-x-2"><Podcast /><p className="justify-center text-lg">Complete Onboarding</p></span>
                    )}
                  </button>
                </div>
            </form>
 
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
