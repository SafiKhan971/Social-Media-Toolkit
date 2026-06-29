import express from 'express'
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses
} from '../controllers/businessController.js'
import { uploadLogo } from '../middlewares/upload.js'

const router = express.Router()

router.get('/all', getAllBusinesses)
router.get('/', getBusinesses)
router.get('/:id', getBusinessById)
router.post('/', uploadLogo.single('logo'), createBusiness)
router.put('/:id', uploadLogo.single('logo'), updateBusiness)
router.delete('/:id', deleteBusiness)

export default router
