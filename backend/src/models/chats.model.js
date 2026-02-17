import mongoose from "mongoose";

const chatsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    latestMessage:{
        type:String,
        default : "New Chat"
    }
},{timestamps:true})

export const Chats = mongoose.model("Chats",chatsSchema)