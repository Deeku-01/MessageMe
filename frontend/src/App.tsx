import { Navigate, Route, Routes } from "react-router-dom"
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
import { useEffect } from "react"

const App=()=>{

const {authUser,isLoading}=useAuthUser();
  const {theme} =useThemeStore();

    useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const isAuthenticated=Boolean(authUser);
  const isOnboarded=authUser?.isOnboarded


  if(isLoading) return <PageLoader/>
  
  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        {/* Home Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated && isOnboarded 
              ? <Layout showsidebar={true}><HomePage/></Layout>
              : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace />
          }
        />
        
        {/* Auth Routes */}
        <Route 
          path="/signup" 
          element={
            !isAuthenticated 
              ? <SignuPage/> 
              : <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
          }
        />
        
        <Route 
          path="/login" 
          element={
            !isAuthenticated 
              ? <LoginPage/> 
              : <Navigate to={isOnboarded ? "/" : "/onboarding"} replace />
          }
        />
        
        <Route 
          path="/onboarding" 
          element={
            isAuthenticated 
              ? (!isOnboarded 
                  ? <OnboardingPage/> 
                  : <Navigate to="/" replace/>
                )
              : <Navigate to="/login" replace/>
          }
        />
        
        {/* Protected Routes */}
        <Route 
          path="/notifications" 
          element={
            isAuthenticated && isOnboarded 
              ? <Layout showsidebar={true}><NoticationsPage/></Layout>
              : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace/>
          }
        />
        
        <Route 
          path="/call/:id" 
          element={
            isAuthenticated && isOnboarded
              ? <Layout showsidebar={true}><CallPage/></Layout>
              : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace/>
          }
        />
        
        <Route 
          path="/chat" 
          element={
            isAuthenticated && isOnboarded
              ? <Layout showsidebar={false}><ChatPage/></Layout>
              : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace/>
          }
        />
        
        <Route 
          path="/chat/:id" 
          element={
            isAuthenticated && isOnboarded
              ? <Layout showsidebar={false}><ChatPage/></Layout>
              : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} replace/>
          }
        />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App