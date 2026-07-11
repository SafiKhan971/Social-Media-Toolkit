import express from 'express'
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses
} from '../controllers/businessController.js'
import { upload } from '../middlewares/upload.js'

const router = express.Router()

router.get('/all', getAllBusinesses)
router.get('/', getBusinesses)
router.get('/:id', getBusinessById)
router.post('/', upload.single('logo'), createBusiness)
router.put('/:id', upload.single('logo'), updateBusiness)
router.delete('/:id', deleteBusiness)

export default router
