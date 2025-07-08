import { useEffect, useState } from "react";
import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthuser";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { Channel as chl, StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";
import CustomMessage from "../components/CustomMessage";

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setchatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<chl | null>(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokendata, error: tokenError} = useQuery({
    queryKey: ["streamToken"],
    queryFn: async () => {
      const token = await axiosInstance.get("/api/chat/token");
      return token.data;
    },
    enabled: !!authUser
  });

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    const initchat = async () => {
      if (!tokendata?.token || !authUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        }, tokendata.token);

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const curChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId]
        });

        await curChannel.watch();

        setchatClient(client);
        setChannel(curChannel);

      } catch (error) {
        console.error("Error Initialising Chat:", error);
        toast.error("Could Not Connect to Chat. Please Try Again");
      } finally {
        setLoading(false);
      }
    };

    initchat();
  }, [tokendata, authUser, targetUserId, STREAM_API_KEY]);

  const handleVideoCall = () => {
  if (channel) {
    const callUrl = `${window.location.origin}/call/${channel.id}`;

    channel.sendMessage({
      text: `${authUser?.fullName} started a video call`,
      attachments: [
        {
          type: "video-call",
          title: "Video Call",
          title_link: callUrl,
          text: "Click to join",
          // Clean, modern minimalist image
          thumb_url: "/vidcall.png",
          call_url: callUrl,
          fields: [
            {
              title: "Host",
              value: authUser?.fullName || "Unknown",
              short: true
            },
            {
              title: "Duration",
              value: "60 minutes",
              short: true
            }
          ]
        } as any,
      ],
    });

    toast.success("Video call invitation sent!");
  }
};


  if (!authUser) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-base-content/70">Please log in to access chat</p>
        </div>
      </div>
    );
  }

  if (!targetUserId) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-base-content/70">Invalid chat target</p>
        </div>
      </div>
    );
  }

  if (!STREAM_API_KEY) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-base-content/70">Chat configuration error</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-base-content/70">Error loading chat token</p>
        </div>
      </div>
    );
  }

  if (loading || !chatClient || !channel) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-base-content/70">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[93vh] bg-white dark:bg-gray-900 transition-colors">
      <Chat client={chatClient}>
        <Channel channel={channel} Message={CustomMessage}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;