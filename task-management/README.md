# Task Management API

A secure Task Management REST API with JWT authentication, password encryption, and SQLite database.

## Features
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔒 **Password Encryption** - Bcrypt hashing for secure passwords
- ✅ **Task CRUD Operations** - Create, read, update, delete tasks
- 🛡️ **Protected Routes** - All task endpoints require authentication
- 📊 **User-specific Tasks** - Each user sees only their own tasks
- 🚀 **Proper HTTP Status Codes** - Standardized response codes
- ✅ **Input Validation** - Comprehensive payload validation

## Tech Stack
- **Node.js** + **Express.js**
- **TypeScript** for type safety
- **SQLite** database with migrations
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled

## Environment Variables
Create a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SQLITE_PATH=./data/task-management.sqlite
```

## Setup & Installation
```bash
npm install
npm run build
npm run dev
```

## API Endpoints

### Authentication Endpoints (Public)
All auth endpoints return JWT tokens for subsequent requests.

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Task Endpoints (Protected - Requires JWT Token)
Include the JWT token in the `Authorization` header: `Bearer <token>`

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Learn TypeScript",
    "description": "Complete TypeScript fundamentals",
    "completed": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": 1
  }
]
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Build API",
  "description": "Create REST API with authentication"
}
```

**Response (201):**
```json
{
  "id": 2,
  "title": "Build API",
  "description": "Create REST API with authentication",
  "completed": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": 1
}
```

#### Update Task
```http
PUT /api/tasks/1
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Learn TypeScript (Updated)",
  "description": "Complete TypeScript fundamentals course",
  "completed": true
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Learn TypeScript (Updated)",
  "description": "Complete TypeScript fundamentals course",
  "completed": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z",
  "userId": 1
}
```

#### Delete Task
```http
DELETE /api/tasks/1
Authorization: Bearer <jwt-token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

## HTTP Status Codes Used
- **200** - Success (GET, PUT, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (invalid token)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (user already exists)
- **500** - Internal Server Error

## Security Features
- **JWT Tokens**: Bearer token authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive payload validation
- **User Isolation**: Users can only access their own tasks
- **CORS Enabled**: Cross-origin requests allowed
- **Error Handling**: Secure error responses (no sensitive data leakage)

## Testing the API

### 1. Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 2. Login to get JWT token:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Use the token to access protected endpoints:
```bash
# Replace YOUR_TOKEN_HERE with the actual token from login
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema
- **users**: id, username, email, password (hashed), createdAt, updatedAt
- **tasks**: id, title, description, completed, createdAt, updatedAt, userId

## Development
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Run production server
```

