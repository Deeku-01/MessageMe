import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthuser";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";

import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const {id:callId}=useParams<{id:string}>()
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: async()=>{
          const token=await axiosInstance.get("/api/chat/token");
          return token.data;
        },
    enabled: !!authUser,
  });

  const checkPermissions = async () => {
  const mic = await navigator.permissions.query({ name: "microphone" as PermissionName });
  const cam = await navigator.permissions.query({ name: "camera" as PermissionName });

  if (mic.state !== "granted" || cam.state !== "granted") {
    toast.error("Please allow camera and microphone permissions to proceed.");
  }
};

  useEffect(()=>{
    const initCall= async()=>{
      
      try{
        console.log("Initialising Stream Video Client...")

        const user={
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePicture
        }

        const videoClient=new StreamVideoClient({
          apiKey:STREAM_API_KEY,
          user,
          token:tokenData.token
        })

        const callInstance=videoClient.call("default",callId!)

        await checkPermissions();
        await callInstance.join({create:true})

        console.log("Joined Call Successfully")

        setClient(videoClient)
        setCall(callInstance)

      }catch(error:any){
            console.log("Error Joining the Call", error);
            if (
              error?.message?.includes("Permission denied") ||
              error?.message?.includes("device not found") ||
              error?.message?.toLowerCase().includes("media") ||
              error?.message?.toLowerCase().includes("camera") ||
              error?.message?.toLowerCase().includes("microphone")
            ) {
              toast.error("Please allow camera and microphone access to join the call.");
            } else {
              toast.error("Could not join the call. Please try again.");
            }
      }
      finally{
        toast.success("Joined!!")
        setIsConnecting(false);
      }
    }
    const isReady = authUser && tokenData?.token && callId;
    if(isReady) initCall()
  },[tokenData,authUser,callId])

  if (isLoading || isConnecting) return <PageLoader />;

  return (
     <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
         <div className="flex items-center justify-center h-full flex-col">
          <p className="mb-2">Could not initialize call. Please refresh or try again later.</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
        )}
      </div>
    </div>
  );
};


const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  if (callingState === CallingState.LEFT) return null;

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage
