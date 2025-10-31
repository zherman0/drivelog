# DriveLog 🚗

A full-stack driving log tracker designed for student drivers to track their practice driving hours. Built with React, TypeScript, PHP, and MySQL/MariaDB.

![Language Stats](https://img.shields.io/github/languages/top/zherman0/drivelog)
![License](https://img.shields.io/github/license/zherman0/drivelog)

## Overview

DriveLog helps student drivers and their parents track driving practice sessions, including start times, end times, descriptions, and total hours logged. Perfect for tracking progress toward licensing requirements.

## Features

- 🔐 **Secure Authentication** - JWT-based auth with salted and peppered passwords
- 📊 **Driving Log Management** - Create, read, update, and delete driving sessions
- 📈 **Statistics Dashboard** - View total hours and driving session counts
- 🔍 **Filtering & Search** - Filter logs by date range
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🛡️ **Secure API** - RESTful PHP API with proper authentication and authorization

## Tech Stack

### Frontend

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Backend

- **PHP** - RESTful API
- **MariaDB/MySQL** - Database
- **JWT** - Authentication tokens
- **bcrypt + HMAC** - Password security (salt + pepper)

### Infrastructure

- Apache with mod_rewrite
- PDO for secure database access

## Project Structure

```
drivelog/
├── src/                    # React frontend source
├── api/                    # PHP REST API
│   ├── config/            # Configuration files
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   └── README.md          # API documentation
├── database/              # Database schema
│   ├── schema.sql         # Table definitions
│   ├── sample_data.sql    # Sample data
│   └── README.md          # Database docs
├── public/                # Static assets
└── SECURITY.md            # Security guidelines

```

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PHP 7.4+
- MariaDB/MySQL
- Apache with mod_rewrite

### 1. Clone the Repository

```bash
git clone https://github.com/zherman0/drivelog.git
cd drivelog
```

### 2. Setup Database

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configure API

```bash
cd api
cp config/credentials.example.php config/credentials.php
# Edit credentials.php with your database credentials and security keys
```

See [api/SETUP.md](api/SETUP.md) for detailed API setup instructions.

### 4. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173`

## API Endpoints

The API is fully documented in [api/README.md](api/README.md).

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/verify` - Verify token

### User Management

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete account

### Driving Logs

- `GET /api/logs` - Get all logs with stats
- `POST /api/logs` - Create log entry
- `GET /api/logs/:id` - Get specific log
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

## Security

This project implements multiple security best practices:

- ✅ JWT authentication with token expiration
- ✅ Passwords hashed with bcrypt + HMAC pepper
- ✅ SQL injection protection via PDO prepared statements
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Credentials externalized (not in version control)

See [SECURITY.md](SECURITY.md) for complete security documentation.

## Development

### Frontend Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### API Development

The API uses PHP with no framework for simplicity and portability. All configuration is in `api/config/credentials.php` (gitignored).

## Production Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder to your web server
3. Configure Apache to serve the API from the `api/` directory
4. Update `api/config/credentials.php` with production credentials
5. Generate strong random keys for JWT and password pepper
6. Enable HTTPS

See [api/SETUP.md](api/SETUP.md) for detailed production deployment checklist.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Zachary Herman** ([@zherman0](https://github.com/zherman0))

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- React + TypeScript template
- Inspired by the need to track student driver progress

---

**Note:** This project is designed for educational purposes and tracking student driver practice hours. Always follow your local DMV/licensing requirements for driver training.
