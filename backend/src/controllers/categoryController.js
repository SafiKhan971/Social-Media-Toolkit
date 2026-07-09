import Category from '../models/Category.js'

// GET /api/categories
export async function getCategories(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6

    const skip = (page - 1) * limit

    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Category.countDocuments()

    res.json({
      categories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
// get /api/categories/:id

export async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
// POST /api/categories

export async function createCategory(req, res) {
  try {
    const { name, tags } = req.body

  const category = await Category.create({
  name,
  tags: tags || [],
})

    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
// PUT /api/categories/:id
// PUT /api/categories/:id
export async function updateCategory(req, res) {
  try {
    const updateData = {
      name: req.body.name,
    }

   if (req.body.tags) {
  updateData.tags = req.body.tags
}

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
// DELETE /api/categories/:id
export async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({ message: 'Category deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
// GET /api/categories/all
export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find()
    res.json({ categories })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}