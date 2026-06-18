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
  },
  { timestamps: true }
)

export default mongoose.model('Business', businessSchema)
