import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from 'react-hot-toast'
import { server } from "../main";

const ChatContext = createContext()

export const ChatProvider = ({children})=>{

    const [messages,setMessages] = useState([])
    const [prompt , setPrompt] = useState("");
    const [newRequestLoading , setNewRequestLoading] = useState(false)

    async function fetchResponse(){
        if(prompt === "") return alert("write prompt")
        setNewRequestLoading(true)
        setPrompt("")
        
        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
                method: "POST",
                headers:{
                    "content-type" : "application/json",
                    "x-goog-api-key": import.meta.env.API_KEY
                },
                data:{
                    contents : [{parts : [
                        {
                            text:prompt
                        }
                    ]}]
                }
            })
            
            const message = {
                question : prompt,
                answer :  response.data.candidates[0].content.parts[0].text,
            }
            setMessages((prev)=>[...prev , message])

            const {data} = await axios.post(`${server}/api/chat/${selected}`,{
                question:prompt,
                answer : response.data.candidates[0].content.parts[0].text,
            },{
                headers:{
                    token:localStorage.getItem("token"),
                }
            })
        } catch (error) {
            alert("somethig went wrong")
            console.log(error)
        } finally{
            setNewRequestLoading(false)
        }
    }
    
    const [chats,setChats] = useState([])

    const [selected,setSelected] = useState(null)

    async function fetchChats(){
        try {
            const {data}=await axios.get(`${server}/api/chat/all`,{
            headers:{
                "token":localStorage.getItem("token")
            },
            });
            setChats(data);
            setSelected(data[0]._id)
        } catch (error) {
            console.log("something went wrong",error)
        }
    }
    
    useEffect(()=>{
        fetchChats()
    },[])

    const [msgLoading , setMsgLoading] = useState(false)

    async function fetchMessages(){
        setMsgLoading(true)
        try {
            const {data} = await axios.get(`${server}/api/chat/${selected}`,{
                headers:{
                    token : localStorage.getItem("token")
                },
            });
            setMessages(data)
        } catch (error) {
            console.log(error)     
        } finally{
            setMsgLoading(false)
        }
    }

    useEffect(()=>{
        fetchMessages()
    },[selected])
    

    const [createLoading, setCreateLoading] = useState(false)

    async function createChat(){
        const token = localStorage.getItem("token")
        if(!token) return
        setCreateLoading(true)
        try {
            await axios.post(`${server}/api/chat/new`,{},{
                headers:{
                    "token":`${token}`
                },
            })
            await fetchChats();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        } finally{
            setCreateLoading(false)
        }
    }
    
    async function deleteChat(id){
        try {
            const {data}= await axios.delete(`${server}/api/chat/${id}`,{
                headers:{
                    token:localStorage.getItem("token")
                },
            });
            toast.success(data.message)
            fetchChats()
            window.location.reload()
        } catch (error) {
            console.log(error)
            alert("something went wrong")
        }
    }
    return(
    <ChatContext.Provider value={{fetchResponse , messages , prompt ,setPrompt , newRequestLoading, chats , fetchChats , createLoading , createChat, selected , setSelected , msgLoading , setMsgLoading , deleteChat}}>
        {children}
    </ChatContext.Provider>
    )
}

export const ChatData = () => useContext(ChatContext);