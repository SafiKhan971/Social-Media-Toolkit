import express from 'express'
import { generatePosts, savePosts, getPosts, deletePost } from '../controllers/postController.js'
import {protect} from '../middlewares/auth.js'

const router = express.Router()

router.post('/generate-posts', protect, generatePosts)
router.post('/save-posts', protect, savePosts)
router.get('/', getPosts)
router.delete('/:id', deletePost)

export default router
