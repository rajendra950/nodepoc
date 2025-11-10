# Swagger API Documentation Guide

## 🎯 Overview

Swagger/OpenAPI documentation has been successfully integrated into your Node.js REST API. You can now visualize and interact with all API endpoints through a beautiful web interface.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Database Migration

The `user_master` table has been added to your Prisma schema. Run the migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Start the Server

```bash
npm run dev
```

### 4. Access Swagger UI

Open your browser and navigate to:

**📚 http://localhost:3000/documentation**

---

## 📊 User Master API Endpoints

### 1. **GET /api/user-master/dummy**
Get 5 dummy records from the `user_master` table.

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, New York, NY 10001",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

### 2. **GET /api/user-master**
Get all records with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)

**Example:**
```bash
curl http://localhost:3000/api/user-master?page=1&limit=10
```

### 3. **GET /api/user-master/:id**
Get a single record by ID.

**Example:**
```bash
curl http://localhost:3000/api/user-master/1
```

### 4. **POST /api/user-master/seed-dummy**
Create 5 dummy records in the database for testing.

**Example:**
```bash
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

---

## 🧪 Testing the API

### Option 1: Using Swagger UI (Recommended)

1. Open http://localhost:3000/documentation
2. Find the "User Master" section
3. Click on any endpoint to expand it
4. Click "Try it out"
5. Fill in parameters (if required)
6. Click "Execute"
7. View the response below

### Option 2: Using cURL

#### Create Dummy Data First
```bash
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

#### Get 5 Dummy Records
```bash
curl http://localhost:3000/api/user-master/dummy
```

#### Get All Records with Pagination
```bash
curl "http://localhost:3000/api/user-master?page=1&limit=5"
```

#### Get Record by ID
```bash
curl http://localhost:3000/api/user-master/1
```

### Option 3: Using Postman

1. Import the OpenAPI spec from: http://localhost:3000/documentation/json
2. All endpoints will be automatically added to your collection

---

## 📁 Database Schema

The `user_master` table has been added with the following structure:

```prisma
model UserMaster {
  id        Int      @id @default(autoincrement())
  name      String?
  email     String?  @unique
  phone     String?
  address   String?
  status    String?  @default("active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("user_master")
}
```

### If Your Actual Table Structure is Different

If your existing `user_master` table has different columns, update the schema in `prisma/schema.prisma`:

1. Open `prisma/schema.prisma`
2. Find the `UserMaster` model
3. Modify fields to match your actual table structure
4. Run `npm run prisma:generate` to update the Prisma Client

**Or introspect your existing database:**
```bash
npx prisma db pull
```

This will automatically update the schema based on your actual database structure.

---

## 🎨 Swagger Features

### Available in Swagger UI

✅ **Interactive API Testing** - Test endpoints directly from the browser  
✅ **Request/Response Examples** - See sample data for each endpoint  
✅ **Schema Documentation** - View data models and types  
✅ **Authentication Testing** - Test protected endpoints with JWT tokens  
✅ **Parameter Validation** - See required and optional parameters  
✅ **Response Codes** - View all possible response codes  

### Swagger Configuration

The Swagger configuration is located in:
- `src/plugins/swagger.plugin.ts`

You can customize:
- API title and description
- Server URLs
- Authentication methods
- Tags and grouping
- UI configuration

---

## 🔐 Testing Protected Endpoints

For endpoints that require authentication:

1. **Get Access Token:**
   - Login via `/api/auth/login` endpoint in Swagger
   - Copy the `accessToken` from the response

2. **Authorize in Swagger:**
   - Click the "Authorize" button at the top right
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize"

3. **Test Protected Endpoints:**
   - Now you can test protected endpoints
   - The token will be automatically included in requests

---

## 📋 Project Structure

New files created:

```
src/
├── plugins/
│   └── swagger.plugin.ts          # Swagger configuration
├── modules/
│   └── user-master/
│       ├── user-master.module.ts     # Module registration
│       ├── user-master.controller.ts # API endpoints
│       ├── user-master.service.ts    # Business logic
│       └── dto/
│           └── user-master.dto.ts    # Data schemas

prisma/
└── schema.prisma                  # Updated with UserMaster model
```

---

## 🛠️ Customization

### Add More Endpoints

To add more endpoints to the User Master module:

1. Open `src/modules/user-master/user-master.service.ts`
2. Add your business logic methods
3. Open `src/modules/user-master/user-master.controller.ts`
4. Add new route handlers with Swagger schemas

**Example:**
```typescript
fastify.post(
  '/create',
  {
    schema: {
      tags: ['User Master'],
      description: 'Create a new user master record',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          // ... more fields
        },
        required: ['name', 'email'],
      },
      response: {
        201: {
          description: 'Record created',
          ...userMasterResponseSchema,
        },
      },
    },
  },
  async (request, reply) => {
    // Your logic here
  }
);
```

### Update Swagger Configuration

Edit `src/plugins/swagger.plugin.ts` to customize:

```typescript
swagger: {
  info: {
    title: 'Your API Title',
    description: 'Your description',
    version: '2.0.0',
  },
  // ... more options
}
```

---

## 📚 Documentation Endpoints

| URL | Description |
|-----|-------------|
| http://localhost:3000/documentation | Interactive Swagger UI |
| http://localhost:3000/documentation/json | OpenAPI JSON spec |
| http://localhost:3000/documentation/yaml | OpenAPI YAML spec |
| http://localhost:3000/health | Health check |

---

## 🐛 Troubleshooting

### Swagger UI Not Loading

**Issue:** 404 error when accessing `/documentation`

**Solution:**
```bash
# Reinstall dependencies
npm install

# Restart server
npm run dev
```

### Table Not Found Error

**Issue:** `table "user_master" does not exist`

**Solution:**
```bash
# Run migration
npm run prisma:migrate

# Or create the table manually in PostgreSQL
```

### No Data Returned

**Issue:** Empty array when calling `/api/user-master/dummy`

**Solution:**
```bash
# Seed dummy data first
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

---

## 💡 Tips

1. **Use Swagger for Testing** - It's faster than writing cURL commands
2. **Export OpenAPI Spec** - Download JSON/YAML for client generation
3. **Add Examples** - Include example values in schemas for better docs
4. **Group Endpoints** - Use tags to organize related endpoints
5. **Document Errors** - Include all possible error responses

---

## 🎉 What's Next?

1. ✅ Swagger is configured and running
2. ✅ User Master API endpoints are created
3. ✅ You can test all endpoints interactively

**Try it now:**

1. Open http://localhost:3000/documentation
2. Click on `/api/user-master/seed-dummy`
3. Click "Try it out" → "Execute"
4. Go to `/api/user-master/dummy`
5. Click "Try it out" → "Execute"
6. View your 5 dummy records!

---

## 📖 Additional Resources

- [Fastify Swagger Plugin](https://github.com/fastify/fastify-swagger)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

---

**Happy API Development! 🚀**

