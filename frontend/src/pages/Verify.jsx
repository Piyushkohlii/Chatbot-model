import React, { useState } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/Loading'

const Verify = () => {
  const [otp,setOtp] = useState("")

  const {verifyUser,btnLoading} = UserData()

  const navigate = useNavigate()

    const submitHandler=(e)=>{
      e.preventDefault();
      verifyUser(Number(otp),navigate)
    }
  return (
    <div className='flex justify-center items-center h-screen'>
        <form className='bg-white p-6 rounded shadow-md w-full md:w-[500px]'
        onSubmit={submitHandler}>
            <h2 className='text-2xl mb-4'>Verify</h2>
            <div className='mb-4'>
                <label className="block text-gray-700 mb-2" htmlFor="otp">OTP:  </label>
                <input 
                type="number"  
                id="otp" 
                className='border border-gray-400 p-2 w-full rounded outline-none focus:ring-1 focus:ring-blue-500'
                required
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}/>

            </div>
            <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'
            disabled={btnLoading}>
              {btnLoading ? <LoadingSpinner/> : "Submit"}
            </button>
        </form>
    </div>
  )
}

export default Verify
