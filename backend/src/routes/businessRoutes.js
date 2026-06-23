import express from 'express'
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses
} from '../controllers/businessController.js'

const router = express.Router()

router.get('/all', getAllBusinesses)
router.get('/', getBusinesses)
router.get('/:id', getBusinessById)
router.post('/', createBusiness)
router.put('/:id', updateBusiness)
router.delete('/:id', deleteBusiness)

export default router
