import mongoose from 'mongoose'

const packageSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      required: true,
      trim: true,
    },

    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: false,
      trim: true,
    },

    services: [
      {
        type: String,
        trim: true,
      },
    ],

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Package', packageSchema)