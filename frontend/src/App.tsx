import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import NoticationsPage from "./pages/NoticationsPage"
import CallPage from "./pages/CallPage"
import OnboardingPage from "./pages/OnboardingPage"
import LoginPage from "./pages/LoginPage"
import SignuPage from "./pages/SignuPage"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios"



const App = () => {
  // tanstack query

  const {data,isLoading,error} =useQuery({
    queryKey:["me"],

    queryFn:async()=>{
      const res=await axiosInstance.get("/me")
      return res.data
    },
    retry:false  //doesn't send requests again and again
  })

  console.log(data);


  return (
    <div className="h-screen" data-theme="dark">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignuPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/call" element={<CallPage/>}/>
        <Route path="/onboarding" element={<OnboardingPage/>}/>
        <Route path="/notifications" element={<NoticationsPage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
