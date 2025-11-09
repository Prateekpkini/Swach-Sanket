// import bcrypt from "bcryptjs";

// // In-memory storage
// let users = [];
// let userIdCounter = 1;

// export class UserMemory {
//   constructor(userData) {
//     this.id = userIdCounter++;
//     this.email = userData.email.toLowerCase();
//     this.password = userData.password;
//     this.name = userData.name || '';
//     this.createdAt = new Date();
//     this.updatedAt = new Date();
//   }

//   // Hash password before saving
//   async hashPassword() {
//     if (this.password) {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//     }
//   }

//   // Compare password
//   async comparePassword(candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
//   }

//   // Save user to memory
//   async save() {
//     await this.hashPassword();
//     users.push(this);
//     return this;
//   }

//   // Static methods
//   static async findOne(query) {
//     if (query.email) {
//       return users.find(user => user.email === query.email.toLowerCase());
//     }
//     if (query.id) {
//       return users.find(user => user.id === parseInt(query.id));
//     }
//     return null;
//   }

//   static async findById(id) {
//     return users.find(user => user.id === parseInt(id));
//   }

//   static async create(userData) {
//     // Check if user already exists
//     const existing = await UserMemory.findOne({ email: userData.email });
//     if (existing) {
//       throw new Error('Email already exists');
//     }

//     const user = new UserMemory(userData);
//     await user.save();
//     return user;
//   }

//   // Get all users (for debugging)
//   static getAll() {
//     return users;
//   }

//   // Clear all users (for testing)
//   static clear() {
//     users = [];
//     userIdCounter = 1;
//   }

//   // Seed initial users
//   static async seed() {
//     try {
//       // Clear existing users
//       UserMemory.clear();

//       // Create admin user
//       const admin = await UserMemory.create({
//         email: 'admin@swachsanket.com',
//         password: 'admin123',
//         name: 'Admin User'
//       });

//       // Create test user
//       const testUser = await UserMemory.create({
//         email: 'test@swachsanket.com', 
//         password: 'test123',
//         name: 'Test User'
//       });

//       console.log('✅ In-memory users seeded successfully:');
//       console.log(`Admin - Email: ${admin.email}, Password: admin123`);
//       console.log(`Test - Email: ${testUser.email}, Password: test123`);

//       return { admin, testUser };
//     } catch (error) {
//       console.error('❌ Error seeding users:', error.message);
//       throw error;
//     }
//   }
// }



import bcrypt from "bcryptjs";

// In-memory storage
let users = [];
let userIdCounter = 1;

export class UserMemory {
  constructor(userData) {
    this.id = userIdCounter++;
    this.email = userData.email.toLowerCase();
    this.password = userData.password;
    this.name = userData.name || '';
    this.role = userData.role || 'mrf_driver';
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Check if user has required role
  hasRole(roles) {
    if (Array.isArray(roles)) {
      return roles.includes(this.role);
    }
    return this.role === roles;
  }

  // Save user to memory
  async save() {
    await this.hashPassword();
    users.push(this);
    return this;
  }

  // Static methods
  static async findOne(query) {
    if (query.email) {
      return users.find(user => user.email === query.email.toLowerCase());
    }
    if (query.id) {
      return users.find(user => user.id === parseInt(query.id));
    }
    if (query.role) {
      return users.find(user => user.role === query.role);
    }
    return null;
  }

  static async findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  static async findByRole(role) {
    return users.filter(user => user.role === role);
  }

  static async create(userData) {
    // Validate role
    const validRoles = ['zilla_panchayat', 'mrf_operator', 'mrf_driver'];
    if (userData.role && !validRoles.includes(userData.role)) {
      throw new Error('Invalid role. Must be: zilla_panchayat, mrf_operator, or mrf_driver');
    }

    // Check if user already exists
    const existing = await UserMemory.findOne({ email: userData.email });
    if (existing) {
      throw new Error('Email already exists');
    }

    const user = new UserMemory(userData);
    await user.save();
    return user;
  }

  // Get all users (for debugging)
  static getAll() {
    return users;
  }

  // Clear all users (for testing)
  static clear() {
    users = [];
    userIdCounter = 1;
  }

  // Seed initial users
  static async seed() {
    try {
      // Clear existing users
      UserMemory.clear();

      // Create Zilla Panchayat Admin
      const admin = await UserMemory.create({
        email: 'admin@swachsanket.com',
        password: 'admin123',
        name: 'Zilla Panchayat Admin',
        role: 'zilla_panchayat'
      });

      // Create MRF Operator
      const operator = await UserMemory.create({
        email: 'operator@swachsanket.com', 
        password: 'operator123',
        name: 'MRF Operator',
        role: 'mrf_operator'
      });

      // Create MRF Driver
      const driver = await UserMemory.create({
        email: 'driver@swachsanket.com',
        password: 'driver123',
        name: 'MRF Driver',
        role: 'mrf_driver'
      });

      console.log('✅ In-memory users seeded successfully:');
      console.log(`Admin (Zilla Panchayat) - Email: ${admin.email}, Password: admin123`);
      console.log(`Operator (MRF) - Email: ${operator.email}, Password: operator123`);
      console.log(`Driver (MRF) - Email: ${driver.email}, Password: driver123`);

      return { admin, operator, driver };
    } catch (error) {
      console.error('❌ Error seeding users:', error.message);
      throw error;
    }
  }
}