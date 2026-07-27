import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = 'uploads'

    if (file.fieldname === 'logo') {
      uploadDir = 'uploads/logos'
    } else if (file.fieldname === 'beforeImage' || file.fieldname === 'afterImage' || file.fieldname === 'backgroundImage') {
      uploadDir = 'uploads/posts'
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`)
  },
})

export const upload = multer({ storage })

// import multer from 'multer'
// import path from 'path'
// import fs from 'fs'

// const logoDir = 'uploads/logos'

// // ensure folder exists
// if (!fs.existsSync(logoDir)) {
//   fs.mkdirSync(logoDir, { recursive: true })
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, logoDir)
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`)
//   },
// })

// export const uploadLogo = multer({ storage })
