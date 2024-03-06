import express from 'express'
import {commentPost, deletePost, getFeedPosts,getUserPosts,likePost} from '../controllers/posts.js'
import { verifyToken} from '../middleware/auth.middleware.js'

const router=express.Router();

router.get('/',verifyToken,getFeedPosts)
router.get('/:userId/posts',verifyToken,getUserPosts)

router.patch('/:id/like',verifyToken,likePost);
router.patch("/:id/comment",verifyToken,commentPost)
router.delete('./:id/deletePost',verifyToken,deletePost)
export default router;