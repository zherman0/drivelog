# DriveLog Database Setup

This directory contains the database schema and setup scripts for the DriveLog application.

## Database Structure

### Tables

#### `user`

Stores user information and authentication credentials.

| Column        | Type                     | Description                       |
| ------------- | ------------------------ | --------------------------------- |
| user_id       | INT (PK, AUTO_INCREMENT) | Unique user identifier            |
| username      | VARCHAR(100) UNIQUE      | Unique username for login         |
| email         | VARCHAR(255) UNIQUE      | User's email address (unique)     |
| password_hash | VARCHAR(255)             | Salted and peppered password hash |
| name          | VARCHAR(255)             | User's full name                  |
| birthdate     | DATE                     | User's date of birth              |
| created_at    | TIMESTAMP                | Record creation timestamp         |
| updated_at    | TIMESTAMP                | Record last update timestamp      |

#### `driving_log`

Stores driving log entries for each user.

| Column      | Type                     | Description                        |
| ----------- | ------------------------ | ---------------------------------- |
| log_id      | INT (PK, AUTO_INCREMENT) | Unique log entry identifier        |
| user_id     | INT (FK)                 | References user(user_id)           |
| start_time  | DATETIME                 | When the driving session started   |
| end_time    | DATETIME                 | When the driving session ended     |
| description | TEXT                     | Description of the driving session |
| created_at  | TIMESTAMP                | Record creation timestamp          |
| updated_at  | TIMESTAMP                | Record last update timestamp       |

### Constraints & Indexes

- **Unique Constraints**:
  - `user.username` must be unique
  - `user.email` must be unique
- **Foreign Key**: `driving_log.user_id` references `user.user_id` with CASCADE on DELETE/UPDATE
- **Check Constraint**: `end_time >= start_time` ensures valid time ranges
- **Indexes**:
  - `user.username` for fast authentication lookups
  - `user.email` for email-based searches
  - `user.name` for faster name searches
  - `driving_log.user_id` for faster joins
  - `driving_log.start_time` and `driving_log.end_time` for time-based queries

## Setup Instructions

### 1. Install MariaDB/MySQL

Make sure you have MariaDB or MySQL installed on your system.

### 2. Create the Database and Tables

```bash
mysql -u root -p < schema.sql
```

### 3. (Optional) Load Sample Data

```bash
mysql -u root -p < sample_data.sql
```

### Alternative: Step-by-step Setup

```bash
# Connect to MySQL/MariaDB
mysql -u root -p

# Run the schema file
source schema.sql;

# (Optional) Load sample data
source sample_data.sql;

# Verify tables were created
SHOW TABLES;
DESCRIBE user;
DESCRIBE driving_log;
```

## Connection Information

Default connection parameters:

- **Host**: localhost
- **Port**: 3306 (MySQL/MariaDB default)
- **Database**: drivelog
- **Charset**: utf8mb4

Make sure to create a dedicated database user for your application with appropriate permissions:

```sql
CREATE USER 'drivelog_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON drivelog.* TO 'drivelog_app'@'localhost';
FLUSH PRIVILEGES;
```

## Notes

- The schema uses InnoDB engine for transaction support and foreign key constraints
- UTF-8 (utf8mb4) encoding is used to support full Unicode including emojis
- Timestamps are automatically managed for created_at and updated_at fields
- Cascade deletes ensure that when a user is deleted, all their driving logs are also removed
- **Password Security**: The `password_hash` field stores salted and peppered password hashes. Never store plain-text passwords. Use bcrypt, argon2, or similar strong hashing algorithms with proper salt and pepper implementation
- Username and email fields have UNIQUE constraints to prevent duplicate accounts
