# Changelog

All notable changes to the Swach Sanket project will be documented in this file.

## [Unreleased] - 2025-11-08

### Added
- **In-Memory Storage System**: Complete alternative to MongoDB for development
  - `User.memory.js`: In-memory user model with bcrypt password hashing
  - `auth.memory.controller.js`: Authentication controllers for memory storage
  - `auth.memory.routes.js`: API routes with debug endpoints
  - `auth.memory.js`: JWT middleware for memory-based users
  - `server.memory.js`: Database-free server configuration

### Changed  
- **Package.json**: Added new npm scripts for memory storage
  - `npm run dev:memory`: Development with in-memory storage
  - `npm start:memory`: Production with in-memory storage
- **README.md**: Comprehensive documentation covering both storage options
- **Environment**: Updated database configuration for consistency

### Features
- 🔐 Complete authentication system (register/login)
- 🛡️ Secure password hashing with bcrypt
- 🎯 JWT token-based authentication  
- 👥 Auto-seeding of test users on server startup
- 🐛 Debug endpoints for development (`GET /api/auth/users`)
- ⚡ Zero-setup development environment
- 📊 Enhanced health check with storage type info

### Test Data
- **Admin User**: admin@swachsanket.com / admin123
- **Test User**: test@swachsanket.com / test123

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/users` - Debug: List all users (memory only)
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/health` - Server health check

### Technical Details
- **Storage Options**: MongoDB (persistent) and In-Memory (session-based)
- **Performance**: Memory storage offers faster response times
- **Development**: Zero-setup with automatic test user creation
- **Production**: MongoDB recommended for data persistence
- **Compatibility**: Identical API for both storage types

### Migration Notes
- Frontend code requires no changes when switching storage types
- Environment variables remain the same except MONGO_URI (not needed for memory)
- All existing MongoDB functionality preserved and unchanged
