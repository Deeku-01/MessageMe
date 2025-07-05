import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"

 const useAuthUser = () => {
  // tanstack query
  const {data:authdata,isLoading} =useQuery({
    queryKey:["authUser"],

    queryFn:async()=>{
      const res=await axiosInstance.get("/me")
      return res.data
    },
    retry:false  //doesn't send requests again and again
  })
    return{
        isLoading,
        authUser:authdata?.user
    }
 }

export default useAuthUser;