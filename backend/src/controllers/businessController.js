import Business from '../models/Business.js'

// GET /api/businesses
export async function getBusinesses(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6

    const skip = (page - 1) * limit

    const businesses = await Business.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Business.countDocuments()

    res.json({
      businesses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/businesses/:id
export async function getBusinessById(req, res) {
  try {
    const business = await Business.findById(req.params.id)
    if (!business) {
      return res.status(404).json({ message: 'Business not found' })
    }
    res.json(business)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/businesses
export async function createBusiness(req, res) {
  try {
    const {
      name,
      category,
      description,
      services,
      website,
      email,
      officeAddress
    } = req.body

    const logo = req.file
      ? `/uploads/logos/${req.file.filename}`
      : ''

    const business = await Business.create({
      name,
      category,
      description,
      website: website || '',
      email: email || '',
      officeAddress: officeAddress || '',
      phones: req.body.phones ? JSON.parse(req.body.phones) : [],
      socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : [],

      services: services
        ? JSON.parse(services)
        : [],
      logo,
    })

    res.status(201).json(business)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/businesses/:id
export async function updateBusiness(req, res) {
  try {
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      website: req.body.website || '',
      email: req.body.email || '',
      officeAddress: req.body.officeAddress || ''
    }
    if(req.body.phones){
      updateData.phones=JSON.parse(req.body.phones)
    }
    if (req.body.socialLinks) {
      updateData.socialLinks=JSON.parse(req.body.socialLinks)
    }
  
    if (req.body.services) {
      updateData.services = JSON.parse(
        req.body.services
      )
    }

    if (req.file) {
      updateData.logo = `/uploads/logos/${req.file.filename}`
    }

    const business =
      await Business.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )

    if (!business) {
      return res.status(404).json({
        message: 'Business not found',
      })
    }

    res.json(business)
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}

// DELETE /api/businesses/:id
export async function deleteBusiness(req, res) {
  try {
    const business = await Business.findByIdAndDelete(req.params.id)

    if (!business) {
      return res.status(404).json({ message: 'Business not found' })
    }

    res.json({ message: 'Business deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getAllBusinesses(req, res) {
  try {
    const businesses = await Business.find()

    res.json({
      businesses,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
