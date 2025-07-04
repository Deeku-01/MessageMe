import { Navigate, Route, Routes } from "react-router"
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

  const {data:authdata,isLoading,error} =useQuery({
    queryKey:["authUser"],

    queryFn:async()=>{
      const res=await axiosInstance.get("/me")
      return res.data
    },
    retry:false  //doesn't send requests again and again
  })

  const authUser=authdata?.user;

  console.log(authUser);


  return (
    <div className="h-screen" data-theme="dark">
      <Routes>
        <Route path="/" element={authUser?<HomePage/>: <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser?<SignuPage/>: <Navigate to="/" />}/>
        <Route path="/login" element={!authUser?<LoginPage/>: <Navigate to="/" />}/>
        <Route path="/call" element={authUser?<CallPage/>: <Navigate to="/login" />}/>
        <Route path="/onboarding" element={authUser?<OnboardingPage/>: <Navigate to="/login" />}/>
        <Route path="/notifications" element={authUser?<NoticationsPage/>: <Navigate to="/login" />}/>
        <Route path="/chat" element={authUser?<ChatPage/>: <Navigate to="/login" />}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
