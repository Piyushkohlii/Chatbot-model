import { createContext, useContext, useEffect, useState } from "react";
import toast,{Toaster}  from 'react-hot-toast'
import axios from 'axios'
import { server } from "../main";

const UserContext = createContext()

export const UserProvider =({children})=>{

    const [btnLoading , setBtnLoading] = useState(false)

    async function loginUser(email,navigate) {
        setBtnLoading(true)
        try {
            const {data} = await axios.post(
                `${server}/api/user/login`,
                {email}
            )
            toast.success(data.message)
            localStorage.setItem("verifyToken",data.verifyToken);
            navigate("/verify")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }finally{
            setBtnLoading(false)
        }
    }
    
    const [user,setUser] = useState([])

    const [isAuth , setIsAuth] = useState(false)

    async function verifyUser(otp,navigate,fetchChats) {
        const verifyToken = localStorage.getItem("verifyToken")
        if(!verifyToken) return toast.error("your otp is incorrect")
        setBtnLoading(true)
        try {
            const {data} = await axios.post(
                `${server}/api/user/verify`,
                {otp , verifyToken}
            )
            toast.success(data.message)
            localStorage.clear()
            localStorage.setItem("token",data.token);
            navigate("/")
            setIsAuth(true)
            setUser(data.user)
            fetchChats
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }finally{
            setBtnLoading(false)
        }
    }
    
    const [loading , setLoading] = useState(true)

    async function fetchUser(){
        try{
            const {data} = await axios.get(`${server}/api/user/me`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            setIsAuth(true);
            setUser(data);
        }catch(error){
            console.log(error)
            setIsAuth(false)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchUser()
    },[])

    const logoutHandler =()=>{
        localStorage.clear()
        toast.success("logged out")
        setIsAuth(false)
        setUser([])
        navigate('/login')
        
    }
    return( 
    <UserContext.Provider value={{btnLoading, loginUser, user , isAuth, setIsAuth, verifyUser, loading , fetchUser , logoutHandler }}>
        {children}
        <Toaster/>
    </UserContext.Provider>
    )
}

export const UserData = () => useContext(UserContext)