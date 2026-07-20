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
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
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
    phones: [
      {
        type: String,
        trim: true,
      },
    ],
    website: {
      type: String,
    },
    email: {
      type: String,
    },
    officeAddress: {
      type: String,
    },
    socialLinks: [
      {
        platform: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Business', businessSchema)
