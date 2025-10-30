# API Setup Instructions

## 1. Install Dependencies

Make sure you have:

- PHP 7.4 or higher
- MariaDB/MySQL
- Apache with mod_rewrite enabled

## 2. Database Setup

Create the database and tables:

```bash
mysql -u root -p < ../database/schema.sql
```

Optional - Load sample data:

```bash
mysql -u root -p < ../database/sample_data.sql
```

## 3. Configure Credentials

Copy the credentials template:

```bash
cp config/credentials.example.php config/credentials.php
```

Edit `config/credentials.php` and set your values:

```php
return [
    'db_host' => 'localhost',
    'db_name' => 'drivelog',
    'db_username' => 'your_database_user',
    'db_password' => 'your_database_password',
    'jwt_secret_key' => 'generate-a-long-random-string-here',
    'password_pepper' => 'another-long-random-string-here',
    'allowed_origin' => 'http://localhost:5173', // Your React app URL
];
```

### Generating Secure Keys

For production, generate strong random keys:

```bash
# On Linux/Mac
openssl rand -base64 32

# Or use PHP
php -r "echo bin2hex(random_bytes(32)) . PHP_EOL;"
```

## 4. Set File Permissions

```bash
chmod 755 api/logs
chmod 600 config/credentials.php  # Make credentials file readable only by owner
```

## 5. Apache Configuration

Your Apache config should look like this (usually in `/etc/httpd/conf.d/driveapi.conf`):

```apache
Alias /driveapi /path/to/drivelog/api

<Directory "/path/to/drivelog/api">
   Options Indexes FollowSymLinks
   AllowOverride All
   Require all granted
</Directory>
```

Restart Apache:

```bash
sudo systemctl restart httpd
```

## 6. Test the API

Visit: `http://localhost/driveapi/health`

Should return:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": 1234567890
  }
}
```

## 7. Production Considerations

### Security Checklist

- [ ] Change all default credentials
- [ ] Generate new JWT secret and pepper (use random 32+ character strings)
- [ ] Set `display_errors Off` in production
- [ ] Use HTTPS in production
- [ ] Update `allowed_origin` to your production domain
- [ ] Create a dedicated database user with limited permissions:

```sql
CREATE USER 'drivelog_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON drivelog.* TO 'drivelog_app'@'localhost';
FLUSH PRIVILEGES;
```

- [ ] Consider implementing rate limiting
- [ ] Set up proper log rotation
- [ ] Review Apache/PHP error logs regularly

### File Permissions (Production)

```bash
# Make sure sensitive files are not readable by web server
chmod 600 config/credentials.php

# Ensure log directory is writable by web server
chmod 755 logs
chown www-data:www-data logs  # or apache:apache on RHEL/Fedora
```

## Troubleshooting

### 500 Internal Server Error

Check Apache error log:

```bash
sudo tail -f /var/log/httpd/error_log
```

### Database Connection Failed

1. Verify database credentials in `config/credentials.php`
2. Test database connection:
   ```bash
   mysql -u your_user -p drivelog
   ```
3. Check if PDO MySQL driver is installed:
   ```bash
   php -m | grep pdo_mysql
   ```

### CORS Issues

Update `allowed_origin` in `config/credentials.php` to match your frontend URL.

## API Documentation

See [README.md](README.md) for complete API endpoint documentation.
