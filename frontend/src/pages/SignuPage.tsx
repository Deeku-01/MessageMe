
import { useState} from "react"
import {LogoOption2} from "../components/Logo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

interface ApiError extends Error {
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

const getErrorMessage = (error: ApiError | null) => {
  if (!error) return "";
  
  if (error.response?.data?.message) {
    return error.response.data.errors[0].message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return "An unexpected error occurred";
};


const SignuPage = () => {
  const [signupdata,setsignupdata]=useState<SignupData>({
    fullName:"",
    email:"",
    password:"",
    termsAccepted:false
  });

  const queryClient=useQueryClient();

  const {mutate:SignUpMutation,isPending,error} =useMutation({
    mutationFn:async () =>{
      const response=await axiosInstance.post("/api/auth/signup",signupdata);
      return response.data;
    },
    onSuccess:() => queryClient.invalidateQueries({queryKey:["authuser"]}), //refetch the data and this time it relodes the page to dashboard 
    onError: (error: ApiError) => {
      console.log(error);
    }
  })

  const handleSignUp= (e:any)=>{
    e.preventDefault();
    SignUpMutation();
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="light">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
            {/* Signup form -Left Side */}
            <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
              {/* Logo */}
              <LogoOption2/>


              {error && (
                
                <div className="alert alert-error mb-4 mt-4">

                  <span>{getErrorMessage(error)}</span>
                  
                </div>
              )}
              
              <div className="w-full">
                <form onSubmit={handleSignUp}>
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold"> Create An Account</h2>
                        <p className="text-sm opacity-70">
                          Join MessageMe and start Your Adventures
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* fullName */}
                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text">Full Name</span>
                            </label>
                            <input type="text" placeholder="John Doe" className="input input-bordered w-full" value={signupdata.fullName} 
                            onChange={(e)=> setsignupdata({...signupdata,fullName:e.target.value})} required></input>
                          </div>
                          {/* Email */}

                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text">Email</span>
                            </label>
                            <input type="text" placeholder="JohnDoe@email.com" className="input input-bordered w-full" value={signupdata.email} 
                            onChange={(e)=> setsignupdata({...signupdata,email:e.target.value})} required></input>
                          </div>
                          {/* Password */}

                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="*****" className="input input-bordered w-full" value={signupdata.password} 
                            onChange={(e)=> setsignupdata({...signupdata,password:e.target.value})} required></input>
                            <p className="text-xs opacity-70 mt-1">
                              Password Must be at least 6 characters long
                            </p>
                          </div>
                          
                          <div className="form-control w-full">
                                <label className="label cursor-pointer justify-start">
                                  <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-primary mr-3" 
                                    checked={signupdata.termsAccepted} 
                                    onChange={(e) => setsignupdata({...signupdata, termsAccepted: e.target.checked})} 
                                    required 
                                  />
                                  <span className="label-text">
                                    I agree to the{' '}
                                    <a href="/terms" className="link link-primary" target="_blank" rel="noopener noreferrer">
                                      Terms and Conditions
                                    </a>
                                    {' '}and{' '}
                                    <a href="/privacy" className="link link-primary" target="_blank" rel="noopener noreferrer">
                                      Privacy Policy
                                    </a>
                                  </span>
                                </label>
                                <p className="text-xs opacity-70 mt-1">
                                  You must accept the terms and conditions to create an account
                                </p>
                              </div>
                      </div>
                      <button className="btn btn-primary w-full" type="submit"> {isPending? (
                        <><span className="loading loading-spinner loading-xs"> Loading...</span></>
                      ):"Create Account"}</button>
                    
                      <div className="form-control w-full mt-4">
                        <p className="text-center text-sm opacity-70">
                          Already have an account?{' '}
                          <a href="/login" className="link link-primary font-medium">
                            Login
                          </a>
                        </p>
                      </div>
                    </div>
                </form>
              </div>

            </div>
            {/* Right Side - Hero/Welcome Section */}
        <div className="hidden w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:flex flex-col justify-center items-center text-white relative ">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
          
          <div className="relative z-10 text-center space-y-6">
            {/* Welcome heading */}
            {/* <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-serif">
                Welcome to
                <br />
                <span className="text-white/90">Neura</span>
              </h1>
            </div> */}

            {/* Photo Illustration */}
            <div className="py-6">
              <div className="relative aspect-square max-w-md mx-auto">
                <img 
                  src="/vids.png" 
                  alt="Neura Chat Illustration" className="w-full h-full" />
              </div><br/>
              <p className="text-xl text-white/80 max-w-md mx-auto leading-relaxed font-normal tracking-normal">
                Where conversations come alive
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignuPage