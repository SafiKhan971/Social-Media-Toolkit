import mongoose from 'mongoose'

const shortSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: false,
    },
    script: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    voice: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Short', shortSchema)
