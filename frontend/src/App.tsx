import { Navigate, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import NoticationsPage from "./pages/NoticationsPage"
import CallPage from "./pages/CallPage"
import OnboardingPage from "./pages/OnboardingPage"
import LoginPage from "./pages/LoginPage"
import SignuPage from "./pages/SignuPage"
import { Toaster } from "react-hot-toast"

import PageLoader from "./components/PageLoader"
import useAuthUser from "./hooks/useAuthuser"
import Layout from "./components/Layout"
import { useThemeStore } from "./store/useThemeStore"

const App=()=>{

const {authUser,isLoading}=useAuthUser();
  const theme =useThemeStore();

  const isAuthenticated=Boolean(authUser);
  const isOnboarded=authUser?.isOnboarded


  if(isLoading) return <PageLoader/>
  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded?<Layout showsidebar={true}><HomePage/></Layout>: <Navigate to={!isAuthenticated? "/login":"/onboarding"} />}/>
        <Route path="/signup" element={!isAuthenticated?<SignuPage/>: <Navigate to={isOnboarded?"/":"/onboarding"} />}/>
        <Route path="/login" element={!isAuthenticated?<LoginPage/>: <Navigate to={isOnboarded?"/":"/onboarding"} />}/>
        <Route path="/call" element={isAuthenticated?<CallPage/>: <Navigate to="/login" />}/>
        <Route path="/onboarding" element={isAuthenticated?(!isOnboarded?(<OnboardingPage/>):(<Navigate to="/"/>)):(<Navigate to="/login"/>)}/>
        <Route path="/notifications" element={isAuthenticated?<NoticationsPage/>: <Navigate to="/login" />}/>
        <Route path="/chat" element={isAuthenticated?<ChatPage/>: <Navigate to="/login" />}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
