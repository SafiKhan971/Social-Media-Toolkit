import Package from '../models/Package.js'

export const createPackage = async (req, res) => {
  try {
    const packageData = await Package.create({
      ...req.body,
    })

    res.status(201).json(packageData)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getPackages = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const filter = {
      // createdBy: req.user.id,
    }

    if (req.query.business) {
      filter.business = req.query.business
    }

    const total = await Package.countDocuments(filter)

    const packages = await Package.find(filter)
      .populate('business', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      packages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const getPackage = async (req, res) => {
  try {
    const packageData = await Package.findOne({
      _id: req.params.id,
      // createdBy: req.user.id,
    })

    if (!packageData) {
      return res.status(404).json({
        message: 'Package not found',
      })
    }

    res.json(packageData)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const updatePackage = async (req, res) => {
  try {
    const packageData = await Package.findOneAndUpdate(
      {
        _id: req.params.id,
        // createdBy: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    )

    if (!packageData) {
      return res.status(404).json({
        message: 'Package not found',
      })
    }

    res.json(packageData)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

export const deletePackage = async (req, res) => {
  try {
    const packageData = await Package.findOneAndDelete({
      _id: req.params.id,
      // createdBy: req.user.id,
    })

    if (!packageData) {
      return res.status(404).json({
        message: 'Package not found',
      })
    }

    res.json({
      message: 'Package deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}