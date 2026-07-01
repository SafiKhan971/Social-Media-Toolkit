import dotenv from 'dotenv'
import { connectDB } from '../config/db.js'
import Business from '../models/Business.js'
import Package from '../models/Package.js'


dotenv.config()

const packageTemplates = {
    'GreenBite Organic Café': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Freshly Brewed Coffee',
                'Organic Breakfast',
                'Healthy Lunch Meals',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Freshly Brewed Coffee',
                'Organic Breakfast',
                'Healthy Lunch Meals',
                'Fresh Smoothies',
                'Vegan Dishes',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
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
        },
    ],

    'FitZone Fitness Center': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Personal Training',
                'Weight Training',
                'Fitness Assessment',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Personal Training',
                'Group Fitness Classes',
                'Weight Training',
                'Yoga Sessions',
                'Nutrition Guidance',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
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
        },
    ],

    'Bella Glow Beauty Salon': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Hair Cutting',
                'Hair Coloring',
                'Threading',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Hair Cutting',
                'Hair Coloring',
                'Facial Treatments',
                'Waxing',
                'Threading',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
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
        },
    ],

    'PrimeNest Real Estate': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Property Sales',
                'Property Rentals',
                'Property Valuation',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Property Sales',
                'Property Rentals',
                'Commercial Real Estate',
                'Property Valuation',
                'Investment Consultation',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Property Sales',
                'Property Rentals',
                'Commercial Real Estate',
                'Property Valuation',
                'Investment Consultation',
                'Property Management',
                'Home Buying Assistance',
                'Legal Documentation Support',
            ],
        },
    ],

    'TechCare Solutions': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Computer Repair',
                'Laptop Repair',
                'Software Installation',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Computer Repair',
                'Laptop Repair',
                'Network Setup',
                'Cloud Solutions',
                'IT Consulting',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Computer Repair',
                'Laptop Repair',
                'Network Setup',
                'Cloud Solutions',
                'Cybersecurity Services',
                'Data Backup',
                'IT Consulting',
                'Software Installation',
            ],
        },
    ],

    'Sweet Crumbs Bakery': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Fresh Bread',
                'Pastries',
                'Cookies',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Fresh Bread',
                'Pastries',
                'Cupcakes',
                'Cookies',
                'Custom Cakes',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Custom Cakes',
                'Birthday Cakes',
                'Fresh Bread',
                'Pastries',
                'Cupcakes',
                'Cookies',
                'Wedding Cakes',
                'Dessert Boxes',
            ],
        },
    ],

    'Ocean Breeze Travel': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Flight Booking',
                'Hotel Reservation',
                'Travel Insurance',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Holiday Packages',
                'Flight Booking',
                'Hotel Reservation',
                'Visa Assistance',
                'Travel Insurance',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Holiday Packages',
                'Flight Booking',
                'Hotel Reservation',
                'Visa Assistance',
                'Travel Insurance',
                'Group Tours',
                'Honeymoon Packages',
                'Airport Transfers',
            ],
        },
    ],

    'Urban Threads': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                "Men's Fashion",
                "Women's Fashion",
                'Fashion Accessories',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                "Men's Fashion",
                "Women's Fashion",
                'Fashion Accessories',
                'Personal Styling',
                'Footwear',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                "Men's Fashion",
                "Women's Fashion",
                'Fashion Accessories',
                'Personal Styling',
                'Seasonal Collections',
                'Footwear',
                'Gift Cards',
                'Online Shopping',
            ],
        },
    ],

    'Healthy Smiles Dental Clinic': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Dental Checkups',
                'Teeth Cleaning',
                'Dental Fillings',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Dental Checkups',
                'Teeth Cleaning',
                'Teeth Whitening',
                'Dental Fillings',
                'Root Canal Treatment',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Dental Checkups',
                'Teeth Cleaning',
                'Teeth Whitening',
                'Braces & Orthodontics',
                'Dental Implants',
                'Root Canal Treatment',
                'Dental Fillings',
                'Emergency Dental Care',
            ],
        },
    ],

    'Elite Auto Care': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Oil Change',
                'Brake Service',
                'Battery Replacement',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Oil Change',
                'Engine Diagnostics',
                'Brake Service',
                'Wheel Alignment',
                'Battery Replacement',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Oil Change',
                'Engine Diagnostics',
                'Brake Service',
                'Wheel Alignment',
                'Car Detailing',
                'Battery Replacement',
                'AC Repair',
                'Tyre Replacement',
            ],
        },
    ],

    'Skyline Travel & Tours': [
        {
            title: 'Basic Package',
            price: 99,
            duration: '30 Days',
            services: [
                'Flight Booking',
                'Hotel Reservation',
                'Travel Insurance',
            ],
        },
        {
            title: 'Standard Package',
            price: 199,
            duration: '60 Days',
            services: [
                'Flight Booking',
                'Hotel Reservation',
                'Visa Assistance',
                'Travel Insurance',
                'Holiday Packages',
            ],
        },
        {
            title: 'Premium Package',
            price: 399,
            duration: '90 Days',
            services: [
                'Flight Booking',
                'Hotel Reservation',
                'Visa Assistance',
                'Travel Insurance',
                'Holiday Packages',
                'Airport Transfers',
                'Group Tours',
                'Corporate Travel',
            ],
        },
    ],
}

async function seedPackages() {
    try {
        await connectDB()

        await Package.deleteMany()

        const businesses = await Business.find()

        const startDate = new Date()
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + 3)

        const packages = []

        for (const business of businesses) {
            const templates = packageTemplates[business.name]

            if (!templates) {
                console.log(`No package templates found for ${business.name}`)
                continue
            }

            for (const template of templates) {
                packages.push({
                    business: business._id,
                    title: template.title,
                    price: template.price,
                    services: template.services,
                    duration: template.duration,
                    startDate,
                    endDate,
                    status: 'Active',
                })
            }
        }

        await Package.insertMany(packages)

        console.log(`✅ ${packages.length} packages created successfully.`)
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedPackages()