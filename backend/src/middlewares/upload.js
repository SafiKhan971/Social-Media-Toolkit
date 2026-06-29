import multer from 'multer'
import path from 'path'
import fs from 'fs'

const logoDir = 'uploads/logos'

// ensure folder exists
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  },
})

export const uploadLogo = multer({ storage })

// import multer from 'multer'
// import path from 'path'

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/logos')
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

// export const uploadLogo = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true)
//     } else {
//       cb(new Error('Only image files are allowed'))
//     }
//   },
// })