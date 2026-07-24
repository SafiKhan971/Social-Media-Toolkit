import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import Business from '../models/Business.js'
import Package from '../models/Package.js'
import Category from '../models/Category.js'

dotenv.config()

// ---------- STEP 1: Categories (required by Business.category) ----------
const categoriesData = [
  { name: 'Coffee Shop', tags: ['coffee', 'cafe', 'espresso', 'beverages'] },
  { name: 'Fitness Center', tags: ['gym', 'workout', 'training', 'health'] },
  { name: 'Beauty Salon', tags: ['makeup', 'spa', 'skincare', 'grooming'] },
]

// ---------- STEP 2: Businesses (all fields filled) ----------
const businessesData = [
  {
    name: 'GreenBite Organic Café',
    description:
      'GreenBite Organic Café serves freshly brewed coffee, organic meals, smoothies, and vegan-friendly options in a relaxing, eco-conscious environment ideal for work and leisure.',
    categoryName: 'Coffee Shop',
    services: ['Dine-in', 'Takeaway', 'Home Delivery', 'Vegan Options'],
    logo: 'https://ui-avatars.com/api/?name=GreenBite+Cafe&background=16a34a&color=fff&size=200',
    phones: ['+92 300 1234567', '+92 51 8765432'],
    website: 'https://greenbitecafe.com',
    email: 'contact@greenbitecafe.com',
    officeAddress: 'Blue Area, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/greenbitecafe' },
      { platform: 'Instagram', url: 'https://instagram.com/greenbitecafe' },
    ],
  },
  {
    name: 'FitZone Fitness Center',
    description:
      'Modern fitness center offering personal training, group classes, premium cardio and weight equipment, and expert nutrition guidance to help members reach their fitness goals.',
    categoryName: 'Fitness Center',
    services: ['Personal Training', 'Group Classes', 'Cardio Zone', 'Nutrition Guidance'],
    logo: 'https://ui-avatars.com/api/?name=FitZone+Fitness&background=2563eb&color=fff&size=200',
    phones: ['+92 301 9876543'],
    website: 'https://fitzonecenter.com',
    email: 'info@fitzonecenter.com',
    officeAddress: 'F-7 Markaz, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/fitzone' },
      { platform: 'Facebook', url: 'https://facebook.com/fitzone' },
    ],
  },
  {
    name: 'Bella Glow Beauty Salon',
    description:
      'Professional beauty salon specializing in hair styling, skincare treatments, makeup, and bridal packages, delivered by experienced and certified beauty professionals.',
    categoryName: 'Beauty Salon',
    services: ['Hair Styling', 'Facial Treatments', 'Makeup', 'Bridal Packages'],
    logo: 'https://ui-avatars.com/api/?name=Bella+Glow+Salon&background=f59e0b&color=fff&size=200',
    phones: ['+92 302 1112233', '+92 51 5556677'],
    website: 'https://bellaglowsalon.com',
    email: 'booking@bellaglowsalon.com',
    officeAddress: 'DHA Phase 2, Islamabad, Pakistan',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/bellaglow' },
      { platform: 'Facebook', url: 'https://facebook.com/bellaglow' },
    ],
  },
]

// ---------- STEP 3: Packages (3 per business, all fields filled) ----------
const packageTemplates = {
  'GreenBite Organic Café': [
    {
      title: 'Basic Package',
      price: '2500',
      duration: '30 Days',
      services: ['Freshly Brewed Coffee', 'Organic Breakfast', 'Healthy Lunch Meals'],
      status: 'Active',
    },
    {
      title: 'Standard Package',
      price: '4500',
      duration: '60 Days',
      services: [
        'Freshly Brewed Coffee',
        'Organic Breakfast',
        'Healthy Lunch Meals',
        'Fresh Smoothies',
        'Vegan Dishes',
      ],
      status: 'Active',
    },
    {
      title: 'Premium Package',
      price: '7900',
      duration: '90 Days',
      services: [
        'Freshly Brewed Coffee',
        'Organic Breakfast',
        'Healthy Lunch Meals',
        'Fresh Smoothies',
        'Vegan Dishes',
        'Fresh Juices',
        'Takeaway Orders',
        'Free Wi-Fi',
      ],
      status: 'Active',
    },
  ],
  'FitZone Fitness Center': [
    {
      title: 'Basic Package',
      price: '3000',
      duration: '30 Days',
      services: ['Personal Training', 'Weight Training', 'Fitness Assessment'],
      status: 'Active',
    },
    {
      title: 'Standard Package',
      price: '5500',
      duration: '60 Days',
      services: [
        'Personal Training',
        'Group Fitness Classes',
        'Weight Training',
        'Yoga Sessions',
        'Nutrition Guidance',
      ],
      status: 'Active',
    },
    {
      title: 'Premium Package',
      price: '9900',
      duration: '90 Days',
      services: [
        'Personal Training',
        'Group Fitness Classes',
        'Weight Training',
        'Cardio Equipment',
        'Yoga Sessions',
        'Zumba Classes',
        'Nutrition Guidance',
        'Fitness Assessment',
      ],
      status: 'Active',
    },
  ],
  'Bella Glow Beauty Salon': [
    {
      title: 'Basic Package',
      price: '2000',
      duration: '30 Days',
      services: ['Hair Cutting', 'Hair Coloring', 'Threading'],
      status: 'Active',
    },
    {
      title: 'Standard Package',
      price: '4200',
      duration: '60 Days',
      services: ['Hair Cutting', 'Hair Coloring', 'Facial Treatments', 'Waxing', 'Threading'],
      status: 'Active',
    },
    {
      title: 'Premium Package',
      price: '8500',
      duration: '90 Days',
      services: [
        'Hair Cutting',
        'Hair Coloring',
        'Facial Treatments',
        'Bridal Makeup',
        'Manicure & Pedicure',
        'Waxing',
        'Threading',
        'Skin Care Treatments',
      ],
      status: 'Active',
    },
  ],
}

async function seedBusinessesAndPackages() {
  try {
    await connectDB()

    // --- Clean existing data ---
    await Package.deleteMany()
    await Business.deleteMany()
    // Categories only cleared for the 3 we manage, to avoid wiping unrelated categories
    await Category.deleteMany({ name: { $in: categoriesData.map((c) => c.name) } })

    // --- Insert categories, keep a name -> _id map ---
    const insertedCategories = await Category.insertMany(categoriesData)
    const categoryMap = {}
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id
    })

    // --- Insert businesses with category reference ---
    const businessesToInsert = businessesData.map(({ categoryName, ...rest }) => ({
      ...rest,
      category: categoryMap[categoryName],
    }))

    const insertedBusinesses = await Business.insertMany(businessesToInsert)

    // --- Insert 3 packages for each business ---
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 3)

    const packagesToInsert = []

    for (const business of insertedBusinesses) {
      const templates = packageTemplates[business.name]

      if (!templates) {
        console.log(`⚠️  No package templates found for ${business.name}`)
        continue
      }

      for (const template of templates) {
        packagesToInsert.push({
          business: business._id,
          title: template.title,
          price: template.price,
          services: template.services,
          duration: template.duration,
          startDate,
          endDate,
          status: template.status,
        })
      }
    }

    const insertedPackages = await Package.insertMany(packagesToInsert)

    console.log(`✅ ${insertedCategories.length} categories inserted successfully`)
    console.log(`✅ ${insertedBusinesses.length} businesses inserted successfully`)
    console.log(`✅ ${insertedPackages.length} packages inserted successfully`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeder failed:', error)
    process.exit(1)
  }
}

seedBusinessesAndPackages()