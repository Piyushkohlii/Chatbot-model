import dotenv from 'dotenv'
import express from 'express'
import connectDB from './database/db.js'

dotenv.config({
    path:'./.env'
})

const app = express()

const port = process.env.PORT || 7000

connectDB()
.then(()=>{
app.listen(port,()=>{
    console.log(`server is running on port no. ${port}`)
})
app.on("error",(error)=>{
    console.log("errrr:",error)
    throw error
})
})
.catch((err)=>{
    console.log("MongoDB connection failed : ",err)
})
 
//using middleware
app.use(express.json())

//importing routes
import UserRoutes from "./routes/user.routes.js"

//using routes
app.use("/api/user",UserRoutes)