import axios from 'axios'

export const  axiosInstance= axios.create({
    baseURL:"http://localhost:5001",
    withCredentials:true  //means send the cookies with the req
})