import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { googleClient } from '../utils/googleClient.js'

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    const { email, name, sub: googleId } = payload

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        password: googleId, // not used, just placeholder
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}