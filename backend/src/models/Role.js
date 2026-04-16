import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  },
  permissions: {
    // User Management
    manageUsers: { type: Boolean, default: false },
    viewUsers: { type: Boolean, default: false },
    editUsers: { type: Boolean, default: false },
    deleteUsers: { type: Boolean, default: false },
    toggleUserStatus: { type: Boolean, default: false },
    
    // Book Management
    manageAllBooks: { type: Boolean, default: false },
    createBooks: { type: Boolean, default: true },
    editBooks: { type: Boolean, default: false },
    deleteBooks: { type: Boolean, default: false },
    viewAllBooks: { type: Boolean, default: true },
    editAnyBook: { type: Boolean, default: false },
    deleteAnyBook: { type: Boolean, default: false },
    
    // Dashboard Access
    viewDashboard: { type: Boolean, default: true },
    viewAdminDashboard: { type: Boolean, default: false },
    viewManagerDashboard: { type: Boolean, default: false },
    viewUserDashboard: { type: Boolean, default: true },
    
    // Reports
    viewReports: { type: Boolean, default: false },
    generateReports: { type: Boolean, default: false },
    
    // Settings
    manageSettings: { type: Boolean, default: false },
    
    // Role Management
    assignRoles: { type: Boolean, default: false },
    manageRoles: { type: Boolean, default: false }
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
roleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Role = mongoose.model('Role', roleSchema);

export default Role;