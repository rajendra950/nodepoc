# 🚀 Quick Start Guide

Get the API running in under 2 minutes!

## Option 1: Docker (Easiest) 🐳

```bash
# Start everything
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop
docker-compose down
```

✅ **Done!** API is running at `http://localhost:3000`

## Option 2: Local Development 💻

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (update JWT secrets!)
# Edit .env file and set JWT_SECRET and JWT_REFRESH_SECRET
# They must be at least 32 characters long

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run migrations
npm run prisma:migrate

# 5. Seed database
npm run prisma:seed

# 6. Start dev server
npm run dev
```

✅ **Done!** API is running at `http://localhost:3000`

## Test the API

### 1. Health Check

```bash
curl http://localhost:3000/health
```

### 2. Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

### 3. Get Current User

```bash
# Replace TOKEN with accessToken from login response
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123 | ADMIN |
| user@example.com | User@123 | USER |

## Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm test                 # Run tests
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Create new migration
npm run prisma:seed      # Seed database
```

## Project Structure

```
nodepoc/
├── src/
│   ├── main.ts              # Entry point
│   ├── app.module.ts        # App bootstrap
│   ├── config/              # Configuration
│   ├── common/              # Utilities, filters, pipes
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   └── user/            # User management
│   ├── plugins/             # Fastify plugins
│   ├── database/            # Seeds and migrations
│   └── infra/               # Infrastructure (logger, etc)
├── prisma/
│   └── schema.prisma        # Database schema
└── test/                    # Tests
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### Users (Protected)
- `GET /api/users` - List users (Admin)
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `POST /api/users/:id/roles` - Assign role (Admin)
- `DELETE /api/users/:id/roles/:roleId` - Remove role (Admin)

## Next Steps

1. ✅ API is running
2. 📖 Read [README.md](README.md) for full documentation
3. 🔍 Check [API_EXAMPLES.md](API_EXAMPLES.md) for request examples
4. 🛠️ See [SETUP.md](SETUP.md) for detailed setup guide
5. 🔐 Configure OAuth2 (optional)
6. 🧪 Run tests: `npm test`

## Troubleshooting

### Port 3000 already in use?
Change `PORT` in `.env` file

### Database connection error?
Make sure PostgreSQL is running:
```bash
# Check with Docker
docker ps

# Or check local PostgreSQL
# Windows: Check Services
# Linux: sudo systemctl status postgresql
```

### Prisma Client errors?
```bash
npm run prisma:generate
```

### Need help?
- Check [SETUP.md](SETUP.md) troubleshooting section
- Review logs with `docker-compose logs -f` (Docker)
- Enable debug logging in development

---

🎉 **Happy coding!** Need more help? Check the other docs:
- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Detailed setup
- [API_EXAMPLES.md](API_EXAMPLES.md) - API examples

