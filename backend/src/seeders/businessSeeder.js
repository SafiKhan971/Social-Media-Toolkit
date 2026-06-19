import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Business from '../models/Business.js'

dotenv.config()

const businesses = [
  {
    name: 'GreenBite Organic Café',
    category: 'Coffee Shop',
    description:
      'GreenBite Organic Café serves freshly brewed coffee, organic meals, smoothies, and vegan-friendly options in a relaxing environment.',
  },
  {
    name: 'FitZone Fitness Center',
    category: 'Gym',
    description:
      'Modern fitness center offering personal training, group classes, and premium workout equipment.',
  },
  {
    name: 'Bella Glow Beauty Salon',
    category: 'Beauty Salon',
    description:
      'Professional beauty salon specializing in hair styling, skincare treatments, and makeup services.',
  },
  {
    name: 'PrimeNest Real Estate',
    category: 'Real Estate',
    description:
      'Trusted real estate agency helping clients buy, sell, and rent residential and commercial properties.',
  },
  {
    name: 'TechCare Solutions',
    category: 'IT Services',
    description:
      'IT support company providing computer repair, cybersecurity, cloud services, and network solutions.',
  },
  {
    name: 'Sweet Crumbs Bakery',
    category: 'Bakery',
    description:
      'Artisan bakery known for fresh bread, pastries, custom cakes, and delicious desserts.',
  },
  {
    name: 'Ocean Breeze Travel',
    category: 'Travel Agency',
    description:
      'Travel agency offering holiday packages, flight bookings, hotel reservations, and guided tours.',
  },
  {
    name: 'Urban Threads',
    category: 'Fashion Boutique',
    description:
      'Fashion boutique featuring trendy clothing, accessories, and personalized styling services.',
  },
  {
    name: 'Healthy Smiles Dental Clinic',
    category: 'Dental Clinic',
    description:
      'Modern dental clinic providing preventive care, cosmetic dentistry, and orthodontic treatments.',
  },
  {
    name: 'Elite Auto Care',
    category: 'Automotive Service',
    description:
      'Full-service automotive workshop offering maintenance, repairs, diagnostics, and detailing.',
  },
]

async function seedBusinesses() {
  try {
    await connectDB()

    await Business.deleteMany()

    const inserted = await Business.insertMany(businesses)

    console.log(
      `✅ ${inserted.length} businesses inserted successfully`
    )

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeder failed:', error)
    process.exit(1)
  }
}

seedBusinesses()