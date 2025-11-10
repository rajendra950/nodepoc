# User Master API - Quick Reference

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Run Migrations
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Access Swagger Documentation
Open: **http://localhost:3000/documentation**

---

## 📊 API Endpoints

### Base URL
```
http://localhost:3000/api/user-master
```

---

## 🎯 Quick Test (3 Steps)

### Step 1: Seed Dummy Data
```bash
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

**Response:**
```json
{
  "message": "Dummy records created successfully",
  "count": 5,
  "records": [...]
}
```

### Step 2: Get 5 Dummy Records
```bash
curl http://localhost:3000/api/user-master/dummy
```

**Response:**
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
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567891",
    "address": "456 Oak Ave, Los Angeles, CA 90001",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  ...3 more records
]
```

### Step 3: Test in Swagger UI
1. Open http://localhost:3000/documentation
2. Scroll to "User Master" section
3. Click on `GET /api/user-master/dummy`
4. Click "Try it out"
5. Click "Execute"
6. See the response!

---

## 📋 All Available Endpoints

### 1. Get 5 Dummy Records
```http
GET /api/user-master/dummy
```

**No parameters required**

**Try it:**
```bash
curl http://localhost:3000/api/user-master/dummy
```

---

### 2. Get All Records (Paginated)
```http
GET /api/user-master?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10

**Try it:**
```bash
# Get first page with 10 records
curl "http://localhost:3000/api/user-master?page=1&limit=10"

# Get first page with 5 records
curl "http://localhost:3000/api/user-master?page=1&limit=5"

# Get second page
curl "http://localhost:3000/api/user-master?page=2&limit=10"
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Record by ID
```http
GET /api/user-master/:id
```

**Parameters:**
- `id` (required): Record ID

**Try it:**
```bash
curl http://localhost:3000/api/user-master/1
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, New York, NY 10001",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 4. Seed Dummy Data
```http
POST /api/user-master/seed-dummy
```

**No parameters required**

**Try it:**
```bash
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

**Response:**
```json
{
  "message": "Dummy records created successfully",
  "count": 5,
  "records": [...]
}
```

**Note:** This creates 5 dummy records:
1. John Doe
2. Jane Smith
3. Bob Johnson
4. Alice Williams
5. Charlie Brown

---

## 🔧 Testing with Different Tools

### Using Browser
Simply paste these URLs in your browser:

```
http://localhost:3000/api/user-master/dummy
http://localhost:3000/api/user-master
http://localhost:3000/api/user-master/1
```

### Using Swagger UI (Recommended)
1. Go to http://localhost:3000/documentation
2. All endpoints are documented there
3. Interactive testing with "Try it out" button

### Using Postman
1. Import OpenAPI spec from: http://localhost:3000/documentation/json
2. All endpoints will be available in your collection

### Using JavaScript/Fetch
```javascript
// Get 5 dummy records
fetch('http://localhost:3000/api/user-master/dummy')
  .then(res => res.json())
  .then(data => console.log(data));

// Get all with pagination
fetch('http://localhost:3000/api/user-master?page=1&limit=5')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Using Python
```python
import requests

# Get 5 dummy records
response = requests.get('http://localhost:3000/api/user-master/dummy')
print(response.json())

# Get all with pagination
response = requests.get('http://localhost:3000/api/user-master', params={'page': 1, 'limit': 5})
print(response.json())
```

---

## 🗄️ Database Schema

The `user_master` table structure:

```sql
CREATE TABLE user_master (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Prisma Model:**
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

---

## ⚠️ Important Notes

### If Your Table Structure is Different

If your existing `user_master` table has different columns:

1. **Option 1: Introspect Database**
   ```bash
   npx prisma db pull
   ```
   This will automatically update the Prisma schema.

2. **Option 2: Manual Update**
   - Edit `prisma/schema.prisma`
   - Find the `UserMaster` model
   - Update fields to match your table
   - Run `npm run prisma:generate`

### Table Already Exists

If the `user_master` table already exists in your database:

1. The migration might fail
2. Simply introspect the existing table:
   ```bash
   npx prisma db pull
   npm run prisma:generate
   ```

---

## 📊 Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid parameters) |
| 404 | Not Found (record doesn't exist) |
| 500 | Internal Server Error |

---

## 🎯 Common Use Cases

### Check if API is Working
```bash
curl http://localhost:3000/health
```

### Populate Test Data
```bash
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

### Get Sample Records for Testing
```bash
curl http://localhost:3000/api/user-master/dummy
```

### Get Specific Record
```bash
curl http://localhost:3000/api/user-master/1
```

### Get All Records
```bash
curl http://localhost:3000/api/user-master
```

---

## 🐛 Troubleshooting

### Server Not Starting
```bash
# Check if port 3000 is available
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# Check DATABASE_URL in .env file
```

### Table Not Found
```bash
# Run migrations
npm run prisma:migrate

# Or introspect existing database
npx prisma db pull
npm run prisma:generate
```

### No Data Returned
```bash
# Seed dummy data first
curl -X POST http://localhost:3000/api/user-master/seed-dummy
```

---

## 📚 Documentation Links

- **Swagger UI:** http://localhost:3000/documentation
- **Health Check:** http://localhost:3000/health
- **OpenAPI JSON:** http://localhost:3000/documentation/json
- **Full Guide:** See [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)

---

## ✅ Quick Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Prisma generated (`npm run prisma:generate`)
- [ ] Migrations run (`npm run prisma:migrate`)
- [ ] Server started (`npm run dev`)
- [ ] Dummy data seeded (`POST /api/user-master/seed-dummy`)
- [ ] Swagger UI accessible (http://localhost:3000/documentation)
- [ ] API endpoint tested (`GET /api/user-master/dummy`)

---

## 🎉 You're All Set!

Your User Master API is ready to use!

**Test it now:**
```bash
# 1. Seed data
curl -X POST http://localhost:3000/api/user-master/seed-dummy

# 2. Get records
curl http://localhost:3000/api/user-master/dummy
```

Or open **http://localhost:3000/documentation** for interactive testing!

---

**Need help?** Check [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) for detailed documentation.

