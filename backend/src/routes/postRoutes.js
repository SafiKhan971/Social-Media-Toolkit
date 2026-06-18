import express from 'express'
import { generatePosts, savePosts, getPosts } from '../controllers/postController.js'

const router = express.Router()

router.post('/generate-posts', generatePosts)
router.post('/save-posts', savePosts)
router.get('/', getPosts)

export default router
