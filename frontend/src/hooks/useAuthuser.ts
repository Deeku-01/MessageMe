import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"

 const useAuthUser = () => {
  // tanstack query
  const {data:authdata,isLoading} =useQuery({
    queryKey:["authUser"],

    queryFn:async()=>{
      try{
        const res=await axiosInstance.get("/me")
        return res.data
      }catch(err){
        console.log("no user");
        return null;
      }

    },
    retry:false

  })
    return{
        isLoading,
        authUser:authdata?.user
    }
 }

export default useAuthUser;