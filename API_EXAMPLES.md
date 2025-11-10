# API Examples

This document provides practical examples for using the API endpoints.

## Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Role Management](#role-management)

---

## Authentication

### Register a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null,
    "roles": ["USER"]
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "avatar": null,
    "roles": ["ADMIN"]
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User

**Request:**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "roles": ["ADMIN"],
    "iat": 1640000000,
    "exp": 1640001800
  }
}
```

### Refresh Access Token

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "avatar": null,
    "roles": ["ADMIN"]
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### OAuth2 - Google

**Step 1:** Redirect user to:
```
http://localhost:3000/api/auth/google
```

**Step 2:** User authorizes, Google redirects back to callback

**Step 3:** Get tokens from callback response

### OAuth2 - GitHub

**Step 1:** Redirect user to:
```
http://localhost:3000/api/auth/github
```

**Step 2:** User authorizes, GitHub redirects back to callback

**Step 3:** Get tokens from callback response

---

## User Management

### Get All Users (Admin Only)

**Request:**
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**With Pagination:**
```bash
curl "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**With Search:**
```bash
curl "http://localhost:3000/api/users?search=john&role=USER" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": null,
      "isActive": true,
      "isEmailVerified": false,
      "provider": "LOCAL",
      "roles": [
        {
          "id": "role-id",
          "name": "USER"
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Get User by ID

**Request:**
```bash
curl http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": null,
  "isActive": true,
  "isEmailVerified": false,
  "provider": "LOCAL",
  "roles": [
    {
      "id": "role-id",
      "name": "USER"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update User Profile

**Request (User updating own profile):**
```bash
curl -X PATCH http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "firstName": "Jonathan",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg",
  "isActive": true,
  "isEmailVerified": false,
  "provider": "LOCAL",
  "roles": [
    {
      "id": "role-id",
      "name": "USER"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### Delete User (Admin Only)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```
204 No Content
```

---

## Role Management

### Assign Role to User (Admin Only)

**Request:**
```bash
curl -X POST http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000/roles \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": "role-uuid-here"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": null,
  "isActive": true,
  "isEmailVerified": false,
  "provider": "LOCAL",
  "roles": [
    {
      "id": "role-id-1",
      "name": "USER"
    },
    {
      "id": "role-id-2",
      "name": "MODERATOR"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Remove Role from User (Admin Only)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000/roles/role-uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": null,
  "isActive": true,
  "isEmailVerified": false,
  "provider": "LOCAL",
  "roles": [
    {
      "id": "role-id-1",
      "name": "USER"
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "path": "email",
      "message": "Invalid email address"
    },
    {
      "path": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "error": "UnauthorizedError",
  "message": "Invalid or missing token"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "error": "ForbiddenError",
  "message": "Requires one of these roles: ADMIN"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "error": "NotFoundError",
  "message": "User not found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "error": "ConflictError",
  "message": "User with this email already exists"
}
```

### 429 Too Many Requests

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded, retry in 900000"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Testing with Different Roles

### As Admin

```bash
# Login as admin
export ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}' | jq -r '.tokens.accessToken')

# Test admin endpoint
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### As Regular User

```bash
# Login as user
export USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"User@123"}' | jq -r '.tokens.accessToken')

# Try admin endpoint (should fail)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

## Postman Collection

You can import these examples into Postman:

1. Create a new collection
2. Add environment variables:
   - `base_url`: `http://localhost:3000`
   - `access_token`: (set after login)
3. Add pre-request script to auto-set token:
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('access_token')
   });
   ```

---

Happy testing! 🚀

