import express from 'express'
import { generatePosts } from '../controllers/postController.js'

const router = express.Router()

router.post('/generate', generatePosts)

export default router
