import express from 'express'
import { protect } from '../middlewares/auth.js'
import { deleteShort, generateShort, getShorts, getShortVoices, saveShort } from '../controllers/shortsController.js'

const router = express.Router()

router.get('/voices', getShortVoices)
router.post('/generate', protect, generateShort)
router.post('/save', protect, saveShort)
router.get('/', getShorts)
router.delete('/:id', deleteShort)

export default router
