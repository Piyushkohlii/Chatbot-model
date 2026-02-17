import express from 'express'
import { addConversation, createChat, deleteChat, getAllChats, getConversation } from '../controllers/chats.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const router = express.Router()

router.post("/new" , isAuth,createChat)
router.get("/all" , isAuth,getAllChats)
router.post("/:id",isAuth , addConversation)
router.get("/:id",isAuth, getConversation)
router.delete("/:id",isAuth,deleteChat)

export default router