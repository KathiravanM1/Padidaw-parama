import { connectDB } from './db/db.js';
import Company from './models/Company.js';
import dotenv from 'dotenv';

dotenv.config();

const companies = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla',
  'Uber', 'Airbnb', 'Spotify', 'Adobe', 'Salesforce', 'Oracle', 'IBM',
  'Intel', 'NVIDIA', 'PayPal', 'Twitter', 'LinkedIn', 'Dropbox',
  'Slack', 'Zoom', 'Shopify', 'Square', 'Stripe', 'Coinbase',
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL',
  'Tech Mahindra', 'Capgemini', 'Deloitte', 'PwC', 'EY', 'KPMG'
];

const seedCompanies = async () => {
  try {
    await connectDB();
    
    await Company.deleteMany({});
    
    const companyDocs = companies.map(name => ({ name }));
    await Company.insertMany(companyDocs);
    
    console.log('Companies seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding companies:', error);
    process.exit(1);
  }
};

seedCompanies();