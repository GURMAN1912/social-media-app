import express from 'express'
import {
    getUser,
    getUserFriends,
    addRemoveFriends,
    searchUser,
    } from '../controllers/user.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router=express.Router()

router.get('/:id',verifyToken,getUser)
router.get('/:id/friends',verifyToken,getUserFriends)

router.patch("/:id/:friendId",verifyToken,addRemoveFriends)
// router.get("/:id/all-friends",verifyToken,getAllUsers);
router.get('/',verifyToken,searchUser)

export default router;