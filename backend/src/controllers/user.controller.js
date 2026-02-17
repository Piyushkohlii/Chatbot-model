import sendMail from "../middlewares/sendMail.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const loginUser = async(req,res)=>{
    try{
        const {email}= req.body
         
        let user = await User.findOne({email})

        if(!user){
            user = await User.create({
                email,
            })
        }

        const otp = Math.floow(Math.random()*100000);

        const verifyToken = jwt.sign({user , otp},process.env.Activation_sec,{expiresIn:"5m"})

        await sendMail(email,"Chatbot",otp);

        res.json({
            message:"OTP send to your email",
            verifyToken
        })
    }catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
}