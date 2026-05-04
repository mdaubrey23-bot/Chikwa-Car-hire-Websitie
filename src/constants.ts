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

export const FLEET: Car[] = [];
