# Node.js REST API with Fastify, Prisma & JWT

A production-ready Node.js REST API built with TypeScript, Fastify, Prisma ORM, JWT authentication, and role-based access control (RBAC).

## 🚀 Features

- ⚡ **Fastify** - Fast and low overhead web framework
- 🔐 **JWT Authentication** - Access tokens + refresh tokens
- 🌐 **OAuth2** - Google and GitHub OAuth integration
- 👥 **RBAC** - Role-based access control middleware
- ✅ **Validation** - Input validation with Zod
- 🗄️ **Prisma ORM** - Type-safe database access with migrations
- 🔒 **Security** - Rate limiting, CORS, bcrypt password hashing
- 📝 **Structured Logging** - Pino logger with pretty printing
- 🐳 **Docker** - Containerized with Docker Compose
- 📊 **PostgreSQL** - Robust relational database

## 📁 Project Structure

```
nodepoc/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Application bootstrap
│   ├── config/                 # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── env.validation.ts
│   ├── common/                 # Common utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── utils/
│   ├── modules/                # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   └── strategies/
│   │   └── user/
│   │       ├── user.module.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       └── dto/
│   ├── plugins/                # Fastify plugins
│   │   ├── jwt.plugin.ts
│   │   ├── cors.plugin.ts
│   │   ├── rate-limit.plugin.ts
│   │   ├── oauth.plugin.ts
│   │   └── rbac.plugin.ts
│   ├── database/               # Database related
│   │   └── seeds/
│   └── infra/                  # Infrastructure
│       └── logger/
├── prisma/
│   └── schema.prisma           # Database schema
├── test/                       # Tests
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🛠️ Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn
- Docker & Docker Compose (optional)

## 📦 Installation

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd nodepoc
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/nodeai?schema=public"
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Optional: OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
```

4. **Run database migrations**

```bash
npm run prisma:migrate
```

5. **Seed the database**

```bash
npm run prisma:seed
```

6. **Start the development server**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Docker Deployment

1. **Start with Docker Compose**

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Application on port 3000

2. **View logs**

```bash
docker-compose logs -f app
```

3. **Stop services**

```bash
docker-compose down
```

## 🔑 Default Credentials

After seeding, you can use these test accounts:

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin@123`

**User Account:**
- Email: `user@example.com`
- Password: `User@123`

## 📚 API Endpoints

### Health Check

```
GET /health
```

### Authentication

```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login
POST   /api/auth/refresh         # Refresh access token
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Get current user (protected)
GET    /api/auth/google          # Google OAuth login
GET    /api/auth/google/callback # Google OAuth callback
GET    /api/auth/github          # GitHub OAuth login
GET    /api/auth/github/callback # GitHub OAuth callback
```

### Users

```
GET    /api/users                # Get all users (Admin only)
GET    /api/users/:id            # Get user by ID (authenticated)
PATCH  /api/users/:id            # Update user (owner or admin)
DELETE /api/users/:id            # Delete user (Admin only)
POST   /api/users/:id/roles      # Assign role to user (Admin only)
DELETE /api/users/:id/roles/:roleId # Remove role from user (Admin only)
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Register or Login** to get access and refresh tokens
2. **Include the access token** in the Authorization header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Refresh the token** when it expires using the refresh token

### Example Login Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

### Example Protected Request

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

## 👥 Role-Based Access Control (RBAC)

The API includes three default roles:

- **ADMIN** - Full access to all resources
- **MODERATOR** - Elevated access (read + write users)
- **USER** - Basic access (read only)

Roles are enforced via the `authorize` middleware:

```typescript
fastify.get('/admin-only', {
  onRequest: [fastify.authenticate, fastify.authorize(['ADMIN'])]
}, handler);
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Deploy migrations
npm run prisma:migrate:deploy

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## 📝 Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code
npm run format           # Format code with Prettier
```

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure token-based authentication
- **Refresh Tokens** - Stored in database with expiration
- **Rate Limiting** - Prevent brute force attacks
- **CORS** - Configurable cross-origin requests
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma parameterized queries

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `RATE_LIMIT_TIME_WINDOW` | Rate limit window | `15m` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)
- [Pino](https://getpino.io/)

---

Built with ❤️ using Node.js, TypeScript, and Fastify

