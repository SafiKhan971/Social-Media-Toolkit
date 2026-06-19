import express from 'express'
import { generatePosts, savePosts, getPosts, deletePost } from '../controllers/postController.js'

const router = express.Router()

router.post('/generate-posts', generatePosts)
router.post('/save-posts', savePosts)
router.get('/', getPosts)
router.delete('/:id', deletePost)

export default router
