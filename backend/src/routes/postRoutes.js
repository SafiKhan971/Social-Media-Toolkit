import express from 'express'
import { generatePosts, savePosts, getPosts, deletePost } from '../controllers/postController.js'
import { protect } from '../middlewares/auth.js'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

router.post(
  '/generate-posts',
  protect,
  upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 },
  ]),
  generatePosts
)
router.post('/save-posts', protect, savePosts)
router.get('/', getPosts)
router.delete('/:id', deletePost)

export default router
