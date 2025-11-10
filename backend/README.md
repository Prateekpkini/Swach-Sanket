# Swach Sanket Backend API

## Overview
Backend API for Swach Sanket application with authentication. Supports both MongoDB and in-memory storage options.

## Features
- User authentication (Login/Register)
- JWT token-based authorization
- **Two Storage Options**: MongoDB or In-Memory storage
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting
- Error handling middleware
- Auto-seeding of test users

## Setup Options

### Option 1: In-Memory Storage (Recommended for Development)
**No database installation required!** Data is stored in RAM and resets on server restart.

#### Prerequisites
- Node.js (v16 or higher)

### Option 2: MongoDB Storage (Recommended for Production)
Persistent data storage using MongoDB.

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

## Quick Start

### 🚀 Option 1: In-Memory Storage (Zero Setup)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server with in-memory storage:
   ```bash
   npm run dev:memory
   ```

**That's it!** Server starts at `http://localhost:5000` with test users already created.

### 🗄️ Option 2: MongoDB Storage (Persistent Data)

#### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   MONGO_URI=mongodb://localhost:27017/swach_sanket_db
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   CLIENT_ORIGIN=http://localhost:3000
   GEMINI_API_KEY=your-gemini-api-key-here
   GEMINI_MODEL=gemini-1.5-flash
   ```
   
   **Note:** `GEMINI_API_KEY` is required for the compliance report generation endpoint. You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

#### Database Setup
1. Make sure MongoDB is running on your system
2. Seed initial users (optional):
   ```bash
   npm run seed:users
   ```

#### Running the Server
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Available Scripts
- `npm run dev:memory` - Development with in-memory storage
- `npm start:memory` - Production with in-memory storage  
- `npm run dev` - Development with MongoDB
- `npm start` - Production with MongoDB
- `npm run seed:users` - Seed users in MongoDB

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name" 
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com", 
    "name": "User Name"
  }
}
```

#### POST /api/auth/login
Login with existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Health Check

#### GET /api/health
Check if the server is running
```json
{
  "ok": true,
  "storage": "memory",
  "users": 2,
  "timestamp": "2025-11-08T04:11:09.129Z",
  "uptime": 243.75
}
```

#### GET /api/auth/users (Debug - In-Memory Only)
View all users in memory (development only)
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@swachsanket.com",
      "name": "Admin User",
      "createdAt": "2025-11-08T04:07:06.373Z"
    }
  ]
}
```

### Compliance Reports

#### POST /api/compliance/generate
Generate a compliance report based on provided data. Requires authentication.

Request Body:
```json
{
  "meta": {
    "taluk": "Mangalore",
    "panchayat": "Neermarga",
    "vehicleRegNo": "KA19AA5525"
  },
  "date": "2025-11-08",
  "metrics": {
    "segregationHouseholdsRate": 0.85,
    "segregationShopsRate": 0.90,
    "wetMgmtEfficiency": 0.98,
    "sanitaryDisposalEfficiency": 0.95,
    "dryStorageRatio": 0.10,
    "perHouseholdWasteKg": 3.15,
    "score": 88,
    "band": "Good"
  },
  "inputs": {
    "totals": {
      "totalHouseholds": 520,
      "totalShops": 60
    },
    "day": {
      "households": 501,
      "commercialShops": 54,
      "wetWasteCollected": 980.04,
      "wetWasteManaged": 971.42,
      "sanitaryWasteCollected": 27.51,
      "sanitaryWasteScientificallyDisposed": 26.34,
      "dryWasteCollected": 563.04,
      "dryWasteStored": 57.66
    },
    "weekToDate": {
      "weekStartDate": "2025-11-01",
      "daysCount": 7,
      "avgSegregationHouseholdsRate": 0.82,
      "avgSegregationShopsRate": 0.88,
      "avgWetMgmtEfficiency": 0.96,
      "avgSanitaryDisposalEfficiency": 0.93,
      "avgDryStorageRatio": 0.12,
      "avgPerHouseholdWasteKg": 3.05,
      "avgScore": 85,
      "avgHouseholds": 490,
      "avgCommercialShops": 52,
      "avgWetWasteCollected": 950.00,
      "avgWetWasteManaged": 940.00,
      "avgSanitaryWasteCollected": 25.00,
      "avgSanitaryWasteScientificallyDisposed": 24.00,
      "avgDryWasteCollected": 550.00,
      "avgDryWasteStored": 60.00
    }
  }
}
```

Response:
```json
{
  "success": true,
  "report": {
    "gpAccountHolderSummary": "Wet waste management efficiency remained above 95%...",
    "supervisorySummary": "Comprehensive summary from supervisory viewpoint...",
    "zpMrfSummary": "Brief summary for district or MRF monitoring...",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ],
    "risks": [
      "Risk 1",
      "Risk 2"
    ],
    "notes": "Optional contextual information",
    "dataIrregularities": []
  },
  "meta": {
    "taluk": "Mangalore",
    "panchayat": "Neermarga",
    "vehicleRegNo": "KA19AA5525",
    "date": "2025-11-08"
  }
}
```

**Note:** This endpoint requires `GEMINI_API_KEY` to be set in your `.env` file. The API uses Google's Gemini models to generate compliance reports.

#### POST /api/compliance/generate-from-entry
Generate a compliance report from entry data (material weights) + operational metadata. This endpoint automatically calculates metrics from the provided data.

Request Body:
```json
{
  "meta": {
    "taluk": "Mangalore",
    "panchayat": "Neermarga",
    "vehicleRegNo": "KA19AA5525"
  },
  "date": "2025-11-08",
  "entryId": "690f50316cd4140df5d26dca",
  "entryData": {
    "News Paper": 20,
    "PET bottle": 20,
    "Cardboard": 2
  },
  "totals": {
    "totalHouseholds": 520,
    "totalShops": 60
  },
  "day": {
    "households": 501,
    "commercialShops": 54,
    "wetWasteCollected": 980.04,
    "wetWasteManaged": 971.42,
    "sanitaryWasteCollected": 27.51,
    "sanitaryWasteScientificallyDisposed": 26.34,
    "dryWasteStored": 57.66
  }
}
```

**Note:** 
- `entryId` is optional - if provided, entry data will be fetched from database
- `entryData` is optional - if provided, will be used directly (overrides entryId)
- `dryWasteCollected` is automatically calculated from entry data (sum of all material weights)
- `dryWasteStored` is optional - if not provided, defaults to 10% of dry waste collected
- All compliance metrics (segregation rates, efficiency, score, etc.) are automatically calculated

Response:
```json
{
  "success": true,
  "report": {
    "gpAccountHolderSummary": "...",
    "supervisorySummary": "...",
    "zpMrfSummary": "...",
    "recommendations": [...],
    "risks": [...],
    "notes": "...",
    "dataIrregularities": []
  },
  "meta": {
    "taluk": "Mangalore",
    "panchayat": "Neermarga",
    "vehicleRegNo": "KA19AA5525",
    "date": "2025-11-08"
  },
  "calculatedMetrics": {
    "segregationHouseholdsRate": 0.85,
    "segregationShopsRate": 0.90,
    "wetMgmtEfficiency": 0.98,
    "sanitaryDisposalEfficiency": 0.95,
    "dryStorageRatio": 0.10,
    "perHouseholdWasteKg": 3.15,
    "score": 88,
    "band": "Good"
  },
  "entryData": {
    "dryWasteCollected": 200.5,
    "dryWasteStored": 57.66,
    "materialCount": 3,
    "totalMaterialsWeight": 200.5
  }
}
```

## Authentication
Protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Default Test Users

### In-Memory Storage (Auto-created on startup)
- **Admin User**: 
  - Email: `admin@swachsanket.com`
  - Password: `admin123`
- **Test User**:
  - Email: `test@swachsanket.com` 
  - Password: `test123`

### MongoDB Storage (After running `npm run seed:users`)
- **Admin User**: 
  - Email: `admin@swachsanket.com`
  - Password: `admin123`
- **Test User**:
  - Email: `test@swachsanket.com` 
  - Password: `test123`

## Error Handling
The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Security Features
- Password hashing with bcrypt
- JWT token expiration
- Rate limiting (300 requests per minute per IP)
- CORS protection
- Helmet security headers
- Input validation with Zod

## Storage Options Comparison

| Feature | In-Memory Storage | MongoDB Storage |
|---------|-------------------|-----------------|
| **Setup Time** | Instant (0 setup) | Requires DB installation |
| **Performance** | Faster | Good |
| **Data Persistence** | Lost on restart | Permanent |
| **Scalability** | Single server | Multi-server support |
| **Production Ready** | No | Yes |
| **Development** | Perfect | Good |
| **Test Users** | Auto-created | Manual seeding |
| **Memory Usage** | Low | Moderate |

## Recommendations
- **Development/Testing**: Use in-memory storage (`npm run dev:memory`)
- **Production**: Use MongoDB storage (`npm run dev`)
- **Learning/Prototyping**: Use in-memory storage for quick setup
- **Scalable Apps**: Use MongoDB for data persistence

## Switching Between Storage Types
The API endpoints are identical for both storage types, so you can easily switch:
1. **To Memory**: `npm run dev:memory`
2. **To MongoDB**: `npm run dev` (ensure MongoDB is running)

Your frontend code requires no changes when switching storage types!
