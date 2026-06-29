import mongoose from 'mongoose'

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Business description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      trim: true,
    },
    services: [
      {
        type: String,
        trim: true,
      },
    ],
    logo: {
      type: String, // image URL or uploaded file path
      default: '',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Business', businessSchema)