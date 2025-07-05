import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { LogoOption2 } from "../components/Logo";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [loginData,setLoginData]=useState({
    email:"",
    password:""
  });
  const [showPassword, setShowPassword] = useState(false);

  const queryClient=useQueryClient();

  const {mutate:LoginMutation,isPending}=useMutation({
    mutationFn:async()=>{
        const response =await axiosInstance.post("/api/auth/login",loginData);
        return response.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["authUser"]}); 
      toast.success("Login successful!");
    },
    onError:(error:any)=>{
      toast.error(error.response.data.message  || "Login failed");
    }
  })

  const handleLogin=(e:any)=>{
    e.preventDefault();
    LoginMutation();
  }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
  };



  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="light">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <LogoOption2 />
          </div>

          <div className="w-full ">
            <form onSubmit={handleLogin}>
              <div className="space-y-4 mb-6  ">
                <h2 className="text-xl font-semibold">Welcome back</h2>
                <p className="text-sm opacity-70">Sign in to continue your conversations</p>
              </div>

              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                      `}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 
                      `}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>

                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                      onClick={() => {
                        // Navigate to sign up page
                        // Replace with your navigation logic
                        window.location.href = '/signup';
                      }}
                    >
                      Create One
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* You can add a right panel here for branding/images */}
        <div className="hidden lg:block w-1/2 bg-gradient-to-br from-blue-500 to-purple-600">
          {/* Add your branding content here */}
           <div className="py-6">
              <div className="relative aspect-square max-w-md mx-auto">
                <img 
                  src="/login.png" 
                  alt="Neura Chat Illustration" className="w-full h-full" />
              </div><br/>
              <p className="text-xl text-white/80 max-w-md mx-auto leading-relaxed font-normal tracking-normal flex justify-center">
                Welcome back to seamless conversations
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage
