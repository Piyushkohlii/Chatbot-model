import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { GiHamburgerMenu } from "react-icons/gi";
import Header from '../components/Header.jsx';
import { ChatData } from '../context/ChatContext.jsx';
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from '../components/Loading.jsx';
import { IoSend } from "react-icons/io5";

const Home = () => {
  const [isOpen , setIsOpen] = useState(false)

  const toggleSidebar = () =>{
    setIsOpen(!isOpen)
  }

  const {fetchResponse , messages , prompt ,setPrompt , newRequestLoading , msgLoading ,chats} = ChatData()

  const submitHandeler =(e)=>{
    e.preventDefault();
    fetchResponse()
  }
  
  const messageContainerRef = useRef()

  useEffect(()=>{
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTo({
        top:messageContainerRef.current.scrollHeight,
        behavior : "smooth"
      })
    }
  },[messages])

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      <Sidebar isOpen={isOpen} toggleSidebar = {toggleSidebar}/>
      <div className='flex flex-1 flex-col'>
        <button onClick={toggleSidebar} className='md:hidden p-4 bg-gray-800 text-2xl'>
          <GiHamburgerMenu />
        </button>
        <div className='flex-1 p-6 mb-20 md:mb-0'>
          <Header/>

          {msgLoading ? (<LoadingBig/>) : (
            <div className='flex-1 p-6 max-h-[600px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar' ref={messageContainerRef}>
            {
              messages && messages.length>0 ? messages.map((msg,index)=>(
                <div key={index} className='mb-8'>
                  <div className='mb-4 p-4 rounded bg-blue-700 text-white flex gap-3'>
                    <div className="bg-white p-2 rounded-full text-black text-2xl h-10"><CgProfile /></div>
                    {msg.question}
                  </div>
                  <div className='mb-4 p-4 rounded bg-gray-700 text-white flex gap-3'>
                    <div className='pt-3'>
                    <div className="bg-white p-2 rounded-full text-black text-2xl h-10"><FaRobot /></div>
                    </div>
                    <p dangerouslySetInnerHTML={{__html:msg.answer}} className='py-3'></p>
                  </div>
                </div>
              )) : (<p>no chat yet</p>)
            }

            {newRequestLoading && <LoadingSmall/>}
          </div>
          )}
        </div>
      </div>
      {
        chats && chats.length ===0 ? (""):(
          <div className='fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]'>
        <form onSubmit={submitHandeler} className='flex justify-center items-center'>
          <input type="text" placeholder='Enter your prompt here'
          className='flex-grow p-4 bg-gray-700 rounded-l text-white outline-none'
          value={prompt}
          onChange={(e)=> setPrompt(e.target.value)}
          required />
          <button className='p-4 bg-gray-700 rouned-r text-2xl text-white'><IoSend/></button>
        </form>
      </div>
        )
      }
    </div>
  )
}

export default Home
