import Business from '../models/Business.js'

// GET /api/businesses
export async function getBusinesses(req, res) {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 })
    res.json(businesses)
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
    const { name, category, description } = req.body
    console.log(name)

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ message: 'please fill all fields' })
    }

    const business = await Business.create({ name, description, category })
    res.status(201).json(business)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/businesses/:id
export async function updateBusiness(req, res) {
  try {
    const { name, description, category } = req.body

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { name, description, category },
      { new: true, runValidators: true }
    )

    if (!business) {
      return res.status(404).json({ message: 'Business not found' })
    }

    res.json(business)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
