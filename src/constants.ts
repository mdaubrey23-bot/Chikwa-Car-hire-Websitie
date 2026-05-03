/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Car } from './types';

export const COMPANY_DETAILS = {
  name: 'Chikwa Car Hire Limited',
  tagline: 'Vehicle Hiring Experts',
  phone: '+260 977 515759',
  secondaryPhone: '+260 0777 515759',
  landline: '+260 211230290',
  email: 'chikwacarhire2013@gmail.com',
  location: 'Lusaka, Zambia',
  address: 'Plot No. 86138, Off Great North Road, Matero Forestry Complex, Lusaka',
  currency: 'ZMW',
  vatRate: 0.16,
  tpin: '2430893388',
  regNo: '120210012902',
};

export const CLIENTELES = [
  'Zambia Air Force',
  'Zambia Army',
  'JICA (Japan International Cooperation Agency)',
  'UNICEF',
  'Government Ministries',
];

export const BANKERS = [
  { name: 'ATLAS MARA', acc: '0335952951018-ZMW' },
  { name: 'FNB BANK', acc: '62891674759' },
];

export const BRAND_STORY = {
  introduction: 'Chikwa Car Hire Limited was established on 26th August, 2013 and later incorporated a Limited Company on 15th February, 2021. Our major activities are Car hiring services to organisations and individuals and the business community at large.',
  vision: 'To be Zambias best service provider in the car hiring service.',
  mission: 'To provide excellent and manageable services in car hire.',
  values: [
    'To set as a standard of integrity and honesty.',
    'Professionalism in our working culture',
    'Share good practices and setting up a pleasant environment.'
  ],
  successFactors: [
    'A highly committed work force',
    'Time keeping and friendly team.',
    'An excellent and professional after sales service.'
  ]
};

export const SERVICES = [
  {
    id: 'self-drive',
    title: 'Self-Drive',
    description: 'Enjoy the freedom of the road with our wide range of well-maintained vehicles.',
    icon: 'Car',
  },
  {
    id: 'chauffeur',
    title: 'Chauffeur Driven',
    description: 'Professional drivers to take you where you need to go in comfort and style.',
    icon: 'User',
  },
  {
    id: 'airport',
    title: 'Airport Transfers',
    description: 'Reliable pickup and drop-off services for all major airports.',
    icon: 'Plane',
  },
  {
    id: 'shuttle',
    title: 'Shuttle Services',
    description: 'Efficient group transportation for corporate events or private functions.',
    icon: 'Bus',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Best Prices',
    description: 'Competitive rates and transparent pricing with no hidden costs.',
    icon: 'DollarSign',
  },
  {
    title: '24/7 Support',
    description: 'Dedicated customer service team available around the clock.',
    icon: 'Clock',
  },
  {
    title: 'New Fleet',
    description: 'Our cars are regularly serviced and replaced to ensure reliability.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Easy Booking',
    description: 'Quick and seamless quote and booking process.',
    icon: 'Smartphone',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Kelvin M.',
    text: 'Chikwa Car Hire Limited provided excellent service during my business trip. The car was spotless and the driver was professional.',
    rating: 5,
  },
  {
    name: 'Sarah N.',
    text: 'A smooth experience from start to finish. The airport transfer was on time and very comfortable.',
    rating: 5,
  },
];

export const FLEET: Car[] = [
  {
    id: 'suv-lc200',
    name: 'Toyota Land Cruiser 200',
    category: 'Luxury',
    passengers: 7,
    luggage: 5,
    transmission: 'Automatic',
    pricePerDay: 4500,
    image: 'https://images.unsplash.com/photo-1690558667978-57d38356942c?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'suv-prado',
    name: 'Toyota Prado TXL',
    category: 'SUV',
    passengers: 7,
    luggage: 4,
    transmission: 'Automatic',
    pricePerDay: 2500,
    image: 'https://images.unsplash.com/photo-1678174495574-0f2f354f91bb?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 'suv-pajero',
    name: 'Mitsubishi Pajero',
    category: 'SUV',
    passengers: 7,
    luggage: 4,
    transmission: 'Automatic',
    pricePerDay: 2200,
    image: 'https://images.unsplash.com/photo-1698224522927-14f7b6058e0a?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'suv-lc70',
    name: 'Toyota Land Cruiser 70 Series',
    category: 'SUV',
    passengers: 5,
    luggage: 3,
    transmission: 'Manual',
    pricePerDay: 2800,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'ec-tiida',
    name: 'Nissan Tiida',
    category: 'Economy',
    passengers: 5,
    luggage: 2,
    transmission: 'Automatic',
    pricePerDay: 650,
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 'van-quantum',
    name: 'Toyota Quantum',
    category: 'Van',
    passengers: 14,
    luggage: 6,
    transmission: 'Manual',
    pricePerDay: 3500,
    image: 'https://images.unsplash.com/photo-1563227914-722a46618585?q=80&w=2574&auto=format&fit=crop',
  },
];
