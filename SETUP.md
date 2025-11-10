# Setup Guide

This guide will help you set up and run the project from scratch.

## Quick Start (Docker - Recommended)

The fastest way to get started:

```bash
# 1. Clone the repository
git clone <repository-url>
cd nodepoc

# 2. Start the application with Docker
docker-compose up -d

# 3. Check logs
docker-compose logs -f app

# 4. Access the API
# The API is now running at http://localhost:3000
```

The Docker setup will automatically:
- Start PostgreSQL database
- Run database migrations
- Seed the database with test data
- Start the application

## Local Development Setup

### 1. Prerequisites

Make sure you have the following installed:

```bash
# Check Node.js version (20+ required)
node --version

# Check npm version
npm --version

# Check PostgreSQL version (15+ required)
psql --version
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

**Option A: Use existing PostgreSQL**

If you have PostgreSQL installed locally:

```bash
# Create database
psql -U postgres
CREATE DATABASE nodeai;
\q
```

**Option B: Use Docker for PostgreSQL only**

```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=nodeai \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 4. Environment Configuration

Create `.env` file (use the provided template):

```bash
# Copy example env
cp .env.example .env
```

**Important:** Update these values in `.env`:

```env
# Required - Update JWT secrets in production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-make-it-at-least-32-characters

# Optional - Only if you want OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create the database schema
- Generate migration files in `prisma/migrations/`

### 7. Seed the Database

```bash
npm run prisma:seed
```

This will create:
- 3 roles: ADMIN, USER, MODERATOR
- Admin user: `admin@example.com` / `Admin@123`
- Test user: `user@example.com` / `User@123`

### 8. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Verify Installation

### 1. Check Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1.234,
  "environment": "development"
}
```

### 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "roles": ["ADMIN"]
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### 3. Test Protected Endpoint

```bash
# Replace <TOKEN> with the accessToken from login response
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Database Management

### View Database with Prisma Studio

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Edit data
- Run queries

### Create New Migration

After modifying `prisma/schema.prisma`:

```bash
npm run prisma:migrate
```

### Reset Database

**Warning:** This will delete all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run seed script

## OAuth2 Setup (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### GitHub OAuth

1. Go to [GitHub Settings → Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

## Production Deployment

### Environment Variables

Update these for production:

```env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
DATABASE_URL=<production-database-url>
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build and Run

```bash
# Build
npm run build

# Run migrations
npm run prisma:migrate:deploy

# Start
npm start
```

### Docker Production

```bash
# Build image
docker build -t nodepoc:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=<your-db-url> \
  -e JWT_SECRET=<your-secret> \
  -e JWT_REFRESH_SECRET=<your-secret> \
  nodepoc:latest
```

## Troubleshooting

### Database Connection Error

```
Error: Can't reach database server
```

**Solution:**
- Check PostgreSQL is running: `docker ps` or `systemctl status postgresql`
- Verify DATABASE_URL in `.env`
- Check PostgreSQL logs

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
- Change PORT in `.env`
- Or kill process using port 3000:
  ```bash
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Prisma Client Not Generated

```
Error: @prisma/client did not initialize yet
```

**Solution:**
```bash
npm run prisma:generate
```

### Migration Errors

```
Error: Migration failed
```

**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually fix:
npx prisma migrate resolve --applied <migration-name>
```

## Development Tips

### Hot Reload

The dev server uses `tsx watch` for hot reload. Changes to TypeScript files will automatically restart the server.

### Debugging

Add breakpoints in VS Code:

1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

2. Press F5 to start debugging

### API Testing

Use VS Code extensions:
- Thunder Client
- REST Client

Or external tools:
- Postman
- Insomnia
- HTTPie

### Logs

Development logs are pretty-printed with colors.

To see database queries, they're logged in development mode.

## Next Steps

1. ✅ Set up the project
2. 📚 Read the [API documentation](README.md#-api-endpoints)
3. 🔐 Test authentication endpoints
4. 👥 Explore RBAC functionality
5. 🧪 Run tests: `npm test`
6. 🚀 Deploy to production

## Need Help?

- Check [README.md](README.md) for API documentation
- Review example tests in `test/` directory
- Examine module structure in `src/modules/`

---

Happy coding! 🎉

