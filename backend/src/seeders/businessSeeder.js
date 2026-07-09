import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Business from '../models/Business.js'

dotenv.config()

const businesses = [
  {
    name: 'GreenBite Organic Café',
    category: 'Coffee Shop',
    services: ['Dine-in', 'Takeaway', 'Home Delivery', 'Vegan Options'],
    logo: 'https://example.com/uploads/greenbite-logo.png',
    phones: ['+92 300 1234567', '+92 51 8765432'],
    website: 'https://greenbitecafe.com',
    email: 'contact@greenbitecafe.com',
    officeAddress: 'Blue Area, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/greenbitecafe' },
      { platform: 'Instagram', url: 'https://instagram.com/greenbitecafe' },
    ],
    description:
      'GreenBite Organic Café serves freshly brewed coffee, organic meals, smoothies, and vegan-friendly options in a relaxing environment.',
  },
  {
    name: 'FitZone Fitness Center',
    category: 'Gym',
    services: ['Personal Training', 'Group Classes', 'Cardio Zone', 'Nutrition Guidance'],
    logo: 'https://example.com/uploads/fitzone-logo.png',
    phones: ['+92 301 9876543'],
    website: 'https://fitzonecenter.com',
    email: 'info@fitzonecenter.com',
    officeAddress: 'F-7 Markaz, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/fitzone' },
      { platform: 'Facebook', url: 'https://facebook.com/fitzone' },
    ],
    description:
      'Modern fitness center offering personal training, group classes, and premium workout equipment.',
  },
  {
    name: 'Bella Glow Beauty Salon',
    category: 'Beauty Salon',
    services: ['Hair Styling', 'Facial Treatments', 'Makeup', 'Bridal Packages'],
    logo: 'https://example.com/uploads/bellaglow-logo.png',
    phones: ['+92 302 1112233'],
    website: 'https://bellaglowsalon.com',
    email: 'booking@bellaglowsalon.com',
    officeAddress: 'DHA Phase 2, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/bellaglow' },
    ],
    
    description:
      'Professional beauty salon specializing in hair styling, skincare treatments, and makeup services.',
  },
  {
    name: 'PrimeNest Real Estate',
    category: 'Real Estate',
    services: ['Property Buying', 'Property Selling', 'Rental Management', 'Consultancy'],
    logo: 'https://example.com/uploads/primenest-logo.png',
    phones: ['+92 303 4445566', '+92 51 2223344'],
    website: 'https://primenestrealestate.com',
    email: 'contact@primenestrealestate.com',
    officeAddress: 'Bahria Town, Rawalpindi, Pakistan',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/primenest' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/primenest' },
    ],
    description:
      'Trusted real estate agency helping clients buy, sell, and rent residential and commercial properties.',
  },
  {
    name: 'TechCare Solutions',
    category: 'IT Services',
    services: ['Computer Repair', 'Cybersecurity', 'Cloud Services', 'Network Setup'],
    logo: 'https://example.com/uploads/techcare-logo.png',
    phones: ['+92 304 7778899'],
    website: 'https://techcaresolutions.com',
    email: 'support@techcaresolutions.com',
    officeAddress: 'I-8 Markaz, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/techcare' },
      { platform: 'Facebook', url: 'https://facebook.com/techcare' },
    ],
    description:
      'IT support company providing computer repair, cybersecurity, cloud services, and network solutions.',
  },
  {
    name: 'Sweet Crumbs Bakery',
    category: 'Bakery',
    services: ['Custom Cakes', 'Fresh Bread', 'Pastries', 'Event Catering'],
    logo: 'https://example.com/uploads/sweetcrumbs-logo.png',
    phones: ['+92 305 5556677'],
    website: 'https://sweetcrumbsbakery.com',
    email: 'orders@sweetcrumbsbakery.com',
    officeAddress: 'G-9 Markaz, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/sweetcrumbs' },
    ],
    description:
      'Artisan bakery known for fresh bread, pastries, custom cakes, and delicious desserts.',
  },
  {
    name: 'Ocean Breeze Travel',
    category: 'Travel Agency',
    services: ['Flight Booking', 'Hotel Reservation', 'Holiday Packages', 'Guided Tours'],
    logo: 'https://example.com/uploads/oceanbreeze-logo.png',
    phones: ['+92 306 8889900', '+92 51 3334455'],
    website: 'https://oceanbreezetravel.com',
    email: 'bookings@oceanbreezetravel.com',
    officeAddress: 'Blue Area, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/oceanbreeze' },
      { platform: 'Instagram', url: 'https://instagram.com/oceanbreeze' },
    ],
    description:
      'Travel agency offering holiday packages, flight bookings, hotel reservations, and guided tours.',
  },
  {
    name: 'Urban Threads',
    category: 'Fashion Boutique',
    services: ['Custom Tailoring', 'Personal Styling', 'Accessories', 'Seasonal Collections'],
    logo: 'https://example.com/uploads/urbanthreads-logo.png',
    phones: ['+92 307 1234988'],
    website: 'https://urbanthreads.com',
    email: 'hello@urbanthreads.com',
    officeAddress: 'Centaurus Mall, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/urbanthreads' },
      { platform: 'Facebook', url: 'https://facebook.com/urbanthreads' },
    ],
    description:
      'Fashion boutique featuring trendy clothing, accessories, and personalized styling services.',
  },
  {
    name: 'Healthy Smiles Dental Clinic',
    category: 'Dental Clinic',
    services: ['Preventive Care', 'Cosmetic Dentistry', 'Orthodontics', 'Teeth Whitening'],
    logo: 'https://example.com/uploads/healthysmiles-logo.png',
    phones: ['+92 308 6667788'],
    website: 'https://healthysmilesdental.com',
    email: 'appointments@healthysmilesdental.com',
    officeAddress: 'F-10 Markaz, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/healthysmiles' },
    ],
    description:
      'Modern dental clinic providing preventive care, cosmetic dentistry, and orthodontic treatments.',
  },
  {
    name: 'Elite Auto Care',
    category: 'Automotive Service',
    services: ['Maintenance', 'Engine Repair', 'Diagnostics', 'Car Detailing'],
    logo: 'https://example.com/uploads/eliteautocare-logo.png',
    phones: ['+92 309 9990011', '+92 51 4445566'],
    website: 'https://eliteautocare.com',
    email: 'service@eliteautocare.com',
    officeAddress: 'Industrial Area, Rawalpindi, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/eliteautocare' },
      { platform: 'Facebook', url: 'https://facebook.com/eliteautocare' },
    ],
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