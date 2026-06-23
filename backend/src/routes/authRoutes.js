import express from 'express'
import { register, login, logout } from '../controllers/authController.js'
import {googleLogin} from '../controllers/googleController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/google-login', googleLogin)

export default router