# DriveLog REST API

PHP-based RESTful API for the DriveLog application.

## Features

- ✅ JWT-based authentication
- ✅ Password hashing with salt and pepper
- ✅ CORS support for frontend integration
- ✅ RESTful endpoints
- ✅ Secure PDO database access
- ✅ Input validation and sanitization
- ✅ Error handling and logging

## Setup

**Important:** See [SETUP.md](SETUP.md) for complete setup instructions.

### Quick Start

1. Copy credentials template:

   ```bash
   cp config/credentials.example.php config/credentials.php
   ```

2. Edit `config/credentials.php` with your database credentials and security keys

3. Create database:

   ```bash
   mysql -u root -p < ../database/schema.sql
   ```

4. Test the API:
   ```
   http://localhost/driveapi/health
   ```

**Never commit `config/credentials.php` - it's gitignored for security.**

## API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "birthdate": "1990-05-15"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "user_id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "birthdate": "1990-05-15"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "user_id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "birthdate": "1990-05-15"
    }
  }
}
```

#### Verify Token

```http
POST /api/auth/verify
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### User Management

#### Get User

```http
GET /api/users/{user_id}
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Update User

```http
PUT /api/users/{user_id}
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "birthdate": "1990-05-15"
}
```

#### Delete User

```http
DELETE /api/users/{user_id}
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Driving Logs

#### Get All Logs

```http
GET /api/logs
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...

# Optional query parameters:
# ?limit=50&offset=0
# ?start_date=2025-01-01&end_date=2025-12-31
```

Response:

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "log_id": 1,
        "user_id": 1,
        "start_time": "2025-10-30 08:00:00",
        "end_time": "2025-10-30 08:30:00",
        "description": "Morning commute"
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 100,
      "offset": 0
    },
    "stats": {
      "total_logs": 50,
      "total_driving_minutes": 1500,
      "total_driving_hours": 25
    }
  }
}
```

#### Get Single Log

```http
GET /api/logs/{log_id}
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Create Log

```http
POST /api/logs
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "start_time": "2025-10-30 08:00:00",
  "end_time": "2025-10-30 08:30:00",
  "description": "Morning commute to work"
}
```

#### Update Log

```http
PUT /api/logs/{log_id}
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json

{
  "start_time": "2025-10-30 08:00:00",
  "end_time": "2025-10-30 08:45:00",
  "description": "Updated description"
}
```

#### Delete Log

```http
DELETE /api/logs/{log_id}
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## Security Features

### Password Security

- **Salted**: Bcrypt automatically generates a unique salt for each password
- **Peppered**: Additional HMAC-SHA256 layer using `PASSWORD_PEPPER` constant
- **Never stored in plain text**: Only hashed passwords are stored in the database

### JWT Authentication

- Tokens expire after 24 hours (configurable)
- Signature verification prevents tampering
- User-specific tokens with user_id and username in payload

### Authorization

- Users can only access their own data
- Log entries are automatically associated with authenticated user
- Proper 401/403 responses for unauthorized access

### Input Validation

- All inputs are sanitized with `htmlspecialchars()` and `strip_tags()`
- Email validation
- Password strength requirements (minimum 8 characters)
- Date/time validation for driving logs

### Database Security

- PDO with prepared statements (prevents SQL injection)
- Parameterized queries for all user inputs
- No direct SQL concatenation

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Development Notes

- JWT implementation is basic. For production, consider using `firebase/php-jwt` library
- Update `ALLOWED_ORIGIN` in config for production deployment
- Set `display_errors Off` in production
- Use HTTPS in production to protect JWT tokens in transit
- Consider implementing refresh tokens for better security
- Add rate limiting for production use

## File Structure

```
api/
├── config/
│   ├── config.php           # App configuration
│   └── database.php         # Database connection
├── models/
│   ├── User.php            # User model
│   └── DrivingLog.php      # Driving log model
├── routes/
│   ├── auth.php            # Authentication endpoints
│   ├── users.php           # User management endpoints
│   └── logs.php            # Driving log endpoints
├── utils/
│   ├── Auth.php            # Authentication utilities
│   └── Response.php        # Response helpers
├── logs/
│   └── .gitkeep
├── .htaccess               # Apache rewrite rules
├── index.php               # Entry point & router
└── README.md
```
