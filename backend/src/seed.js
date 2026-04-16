// seed.js - database seeding script
// populates MongoDB with sample roles, users, and books for testing/demos
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';
import User from './models/User.js';
import Role from './models/Role.js';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/bookstore_auth';

// 15 SAMPLE BOOKS
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    price: 12.99,
    publishedYear: 1925,
    rating: 4.2,
    description: "A classic novel of the Jazz Age",
    inStock: true
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    price: 14.99,
    publishedYear: 1960,
    rating: 4.5,
    description: "A novel about racial injustice in the American South",
    inStock: true
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Sci-Fi",
    price: 10.99,
    publishedYear: 1949,
    rating: 4.3,
    description: "A dystopian social science fiction novel",
    inStock: true
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Technology",
    price: 39.99,
    publishedYear: 2008,
    rating: 4.7,
    description: "A handbook of agile software craftsmanship",
    inStock: true
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    genre: "Technology",
    price: 34.99,
    publishedYear: 1999,
    rating: 4.6,
    description: "Your journey to mastery",
    inStock: true
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    price: 15.99,
    publishedYear: 1965,
    rating: 4.4,
    description: "Epic science fiction novel",
    inStock: true
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    genre: "Biography",
    price: 22.99,
    publishedYear: 2018,
    rating: 4.8,
    description: "Memoir by former First Lady",
    inStock: true
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    price: 18.99,
    publishedYear: 2018,
    rating: 4.7,
    description: "An easy & proven way to build good habits",
    inStock: true
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Mystery",
    price: 16.99,
    publishedYear: 2019,
    rating: 4.1,
    description: "Psychological thriller novel",
    inStock: true
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    price: 20.99,
    publishedYear: 1997,
    rating: 4.9,
    description: "The first novel in the Harry Potter series",
    inStock: true
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    price: 13.99,
    publishedYear: 1988,
    rating: 4.6,
    description: "A philosophical book about following your dreams",
    inStock: true
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Self-Help",
    price: 17.99,
    publishedYear: 2011,
    rating: 4.5,
    description: "About the two systems that drive the way we think",
    inStock: true
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    price: 19.99,
    publishedYear: 2011,
    rating: 4.8,
    description: "Explores the history of humankind",
    inStock: true
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "Mystery",
    price: 14.99,
    publishedYear: 2003,
    rating: 4.0,
    description: "Mystery thriller novel",
    inStock: true
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    price: 25.99,
    publishedYear: 1954,
    rating: 4.9,
    description: "Epic high fantasy novel",
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seed with RBAC...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URL);
    console.log(' Connected to MongoDB');
    
    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
    console.log('Cleared existing data');
    
    //  CREATE ROLES
    console.log('Creating roles...');
    
    const rolesData = [
      {
        name: 'admin',
        permissions: {
          manageUsers: true,
          viewUsers: true,
          editUsers: true,
          deleteUsers: true,
          manageAllBooks: true,
          createBooks: true,
          editBooks: true,
          deleteBooks: true,
          viewAllBooks: true,
          viewDashboard: true,
          viewAdminDashboard: true,
          viewManagerDashboard: true,
          viewReports: true,
          generateReports: true,
          manageSettings: true,
          assignRoles: true,
          manageRoles: true
        },
        description: 'Full system administrator with all permissions'
      },
      {
        name: 'manager',
        permissions: {
          manageUsers: false,
          viewUsers: true,
          editUsers: false,
          deleteUsers: false,
          manageAllBooks: true,
          createBooks: true,
          editBooks: true,
          deleteBooks: true,
          viewAllBooks: true,
          viewDashboard: true,
          viewAdminDashboard: false,
          viewManagerDashboard: true,
          viewReports: true,
          generateReports: false,
          manageSettings: false,
          assignRoles: false,
          manageRoles: false
        },
        description: 'Manager with book management permissions'
      },
      {
        name: 'user',
        permissions: {
          manageUsers: false,
          viewUsers: false,
          editUsers: false,
          deleteUsers: false,
          manageAllBooks: false,
          createBooks: true,
          editBooks: false,
          deleteBooks: false,
          viewAllBooks: true,
          viewDashboard: true,
          viewAdminDashboard: false,
          viewManagerDashboard: false,
          viewReports: false,
          generateReports: false,
          manageSettings: false,
          assignRoles: false,
          manageRoles: false
        },
        description: 'Regular user with basic permissions'
      }
    ];
    
    const roles = await Role.insertMany(rolesData);
    console.log(` Created ${roles.length} roles`);
    
    // Get role references
    const adminRole = roles.find(r => r.name === 'admin');
    const managerRole = roles.find(r => r.name === 'manager');
    const userRole = roles.find(r => r.name === 'user');
    
    //  CREATE DEMO USERS - FIXED APPROACH
    console.log('Creating demo users...');
    
    // Import bcrypt
    const bcrypt = (await import('bcryptjs')).default;
    
    //  CREATE USERS WITH PRE-HASHED PASSWORDS
    const usersData = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    roleName: 'admin',
    role: adminRole._id,
  },
  {
    name: 'Manager User',
    email: process.env.MANAGER_EMAIL,
    password: await bcrypt.hash(process.env.MANAGER_PASSWORD, 10),
    roleName: 'manager',
    role: managerRole._id,
  },
  {
    name: 'Regular User',
    email: process.env.USER_EMAIL,
    password: await bcrypt.hash(process.env.USER_PASSWORD, 10),
    roleName: 'user',
    role: userRole._id,
  }
];
    //  Use insertMany instead of create
    const users = await User.insertMany(usersData);
    console.log(' Created 3 demo users with different roles');
    
    //  CREATE 15 BOOKS
    console.log('Creating 15 sample books...');
    
    const booksData = sampleBooks.map((book, index) => {
      // Distribute books among users
      let addedBy;
      if (index < 5) addedBy = users[2]._id; // User's books (first 5)
      else if (index < 10) addedBy = users[1]._id; // Manager's books (next 5)
      else addedBy = users[0]._id; // Admin's books (last 5)
      
      return {
        ...book,
        addedBy: addedBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    const books = await Book.insertMany(booksData);
    console.log(` Created ${books.length} sample books`);
    
    // Add books to user's favorites
    await User.findByIdAndUpdate(
      users[2]._id,
      { 
        favoriteBooks: [books[0]._id, books[1]._id],
        updatedAt: new Date()
      }
    );
    
    console.log('\nDATABASE SEEDED SUCCESSFULLY!');
    console.log('==================================');
    console.log('ROLES & PERMISSIONS:');
    console.log('  • Admin: Full system access');
    console.log('  • Manager: Book management + view users');
    console.log('  • User: Basic access + own book management');
    
    console.log('\nLOGIN CREDENTIALS:');
    console.log('  • Admin:    admin@example.com / admin123456');
    console.log('  • Manager:  manager@example.com / manager123456');
    console.log('  • User:     user@example.com / user123456');
    
    console.log('\nBOOKS DISTRIBUTION:');
    console.log(`  • Total Books: ${books.length}`);
    console.log('  • User\'s Books: 5 (index 0-4)');
    console.log('  • Manager\'s Books: 5 (index 5-9)');
    console.log('  • Admin\'s Books: 5 (index 10-14)');
    
    console.log('\nTEST LINKS:');
    console.log('  • Frontend: http://localhost:3000');
    console.log('  • Backend:  http://localhost:5000');
    console.log('  • Health:   http://localhost:5000/health');
    
    await mongoose.disconnect();
    console.log('\n Database disconnected');
    process.exit(0);
    
  } catch (error) {
    console.error('\n Error seeding database:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Run seed
seedDatabase();