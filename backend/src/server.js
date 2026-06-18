import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import { connectDB } from './config/db.js'
import businessRoutes from './routes/businessRoutes.js'
import postRoutes from './routes/postRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/businesses', businessRoutes)
app.use('/api/posts', postRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong' })
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
