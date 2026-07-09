import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from '../models/Category.js'

dotenv.config()

const categories = [
  {
    name: 'Fashion Boutique',
    tags: ['clothing', 'trendy', 'apparel', 'style', 'fashion'],
  },
  {
    name: 'Travel Agency',
    tags: ['holidays', 'flights', 'tours', 'packages', 'vacation'],
  },
  {
    name: 'Dental Clinic',
    tags: ['dental care', 'teeth cleaning', 'oral health', 'dentist'],
  },
  {
    name: 'Automotive Service',
    tags: ['car repair', 'maintenance', 'auto workshop', 'vehicle care'],
  },
  {
    name: 'Bakery',
    tags: ['bread', 'pastries', 'cakes', 'desserts', 'fresh baked'],
  },
  {
    name: 'Real Estate',
    tags: ['property', 'buy', 'sell', 'rent', 'housing'],
  },
  {
    name: 'Beauty Salon',
    tags: ['hair styling', 'makeup', 'spa', 'skincare', 'grooming'],
  },
  {
    name: 'IT Services',
    tags: ['computer repair', 'networking', 'cybersecurity', 'tech support'],
  },
  {
    name: 'Coffee Shop',
    tags: ['coffee', 'cafe', 'espresso', 'beverages', 'brew'],
  },
  {
    name: 'Fitness Center',
    tags: ['gym', 'workout', 'training', 'health', 'exercise'],
  },
]

async function seedCategories() {
  try {
await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await Category.deleteMany()
    console.log('Old categories removed')

    await Category.insertMany(categories)
    console.log('10 categories inserted successfully')

    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err.message)
    process.exit(1)
  }
}

seedCategories()