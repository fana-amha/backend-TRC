require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('./src/config/database');
const { Role, User, Category, Institution, Resource } = require('./src/models');

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Role.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Institution.deleteMany();
    await Resource.deleteMany();

    console.log('Inserting Roles...');
    const roles = await Role.insertMany([
      { name: 'ADMIN', description: 'System Administrator' },
      { name: 'RESEARCHER', description: 'Academic Researcher' },
      { name: 'UNIVERSITY', description: 'University Account' },
      { name: 'NGO', description: 'Non-Governmental Organization' },
      { name: 'PUBLIC', description: 'Standard Public User' },
      { name: 'MODERATOR', description: 'Content Moderator' }
    ]);

    const adminRole = roles.find(r => r.name === 'ADMIN');

    console.log('Inserting Institution...');
    const institution = await Institution.create({
      name: 'Tigray Innovation Institute',
      type: 'ResearchCenter',
      website: 'https://tii.edu.et',
      email: 'info@tii.edu.et',
      country: 'Ethiopia',
      city: 'Mekelle',
      verificationStatus: 'Verified'
    });

    console.log('Inserting Admin User...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt); // Default Admin Password

    const adminUser = await User.create({
      fullName: 'System Admin',
      email: 'admin@trc.com',
      passwordHash,
      roleId: adminRole._id,
      institutionId: institution._id,
      verificationStatus: 'Verified',
      accountStatus: 'Active'
    });

    console.log('Inserting Categories...');
    const categories = await Category.insertMany([
      { name: 'Agriculture & Rural Development', description: 'Resources relating to farming and rural studies.' },
      { name: 'Technology & Innovation', description: 'Tech related resources.' },
      { name: 'Health & Medicine', description: 'Medical research and public health reports.' },
      { name: 'Social Sciences', description: 'Cultures, communities, and histories.' }
    ]);

    console.log('Inserting Sample Resource...');
    await Resource.create({
      title: 'The Impact of Technology on Modern Agriculture in Tigray',
      abstract: 'A mock comprehensive study illustrating how technology is redefining crop yields and sustainability.',
      keywords: ['Agriculture', 'Technology', 'Sustainability'],
      categoryId: categories[0]._id,
      uploadedBy: adminUser._id,
      institutionId: institution._id,
      fileURL: 'https://mock-s3-bucket.url/sample-doc.pdf',
      language: 'English',
      status: 'Approved',
      visibility: 'Public',
      publicationDate: new Date()
    });

    console.log('Database Bootstrapped & Seeded Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error(`Error with Seeder: ${error}`);
    process.exit(1);
  }
};

importData();
