import express from 'express'
import {
    createPackage,
    deletePackage,
    getPackage,
    getPackages,
    updatePackage,
} from '../controllers/packageController.js'

const router = express.Router()

router.get('/', getPackages)
router.get('/:id', getPackage)

router.post('/', createPackage)

router.put('/:id', updatePackage)

router.delete('/:id', deletePackage)

export default router