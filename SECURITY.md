# Security & Credentials Management

## Overview

This project uses a secure credential management system to prevent sensitive data from being committed to version control.

## Credential Files

### `api/config/credentials.php` (GITIGNORED)
Contains actual credentials - **NEVER commit this file**

### `api/config/credentials.example.php` (COMMITTED)
Template file for setting up credentials on new installations

## Setup for New Developers

When setting up the project:

1. Copy the example credentials file:
   ```bash
   cp api/config/credentials.example.php api/config/credentials.php
   ```

2. Edit `api/config/credentials.php` with actual values:
   ```php
   return [
       'db_host' => 'localhost',
       'db_name' => 'drivelog',
       'db_username' => 'your_user',
       'db_password' => 'your_password',
       'jwt_secret_key' => 'generate_random_key',
       'password_pepper' => 'generate_random_key',
       'allowed_origin' => 'http://localhost:5173',
   ];
   ```

3. Generate secure keys for production:
   ```bash
   # Generate JWT secret
   openssl rand -base64 32
   
   # Generate password pepper
   openssl rand -base64 32
   ```

## Files Protected by .gitignore

```
# API credentials and sensitive files
api/config/credentials.php
api/logs/*.log

# Temporary test files
api/test*.php
api/index-debug.php
```

## Production Deployment Checklist

- [ ] Generate new random JWT secret key (32+ characters)
- [ ] Generate new random password pepper (32+ characters)
- [ ] Update `allowed_origin` to production domain
- [ ] Use dedicated database user with minimal permissions
- [ ] Set proper file permissions (chmod 600 on credentials.php)
- [ ] Enable HTTPS
- [ ] Review and update error logging settings

## What Gets Committed

✅ **Safe to commit:**
- `api/config/credentials.example.php` - Template
- `api/config/config.php` - Configuration logic
- `api/config/database.php` - Database connection logic
- `api/.gitignore` - Git ignore rules
- All API routes, models, and utilities

❌ **NEVER commit:**
- `api/config/credentials.php` - Actual credentials
- `api/logs/*.log` - Log files
- Any test files with credentials

## Verifying Security Before Push

Before pushing to a public repo, verify credentials are not included:

```bash
# Check what will be committed
git status

# Verify credentials.php is ignored
git check-ignore api/config/credentials.php
# Should output: api/config/credentials.php

# Search for any hardcoded passwords (just to be safe)
grep -r "password" --include="*.php" api/ --exclude-dir=logs
```

## Emergency: Credentials Accidentally Committed

If credentials were committed:

1. **Immediately** change all passwords and keys
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch api/config/credentials.php" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if already pushed to remote)
4. Inform team to re-clone

## Additional Security Measures

- Keep PHP and dependencies updated
- Use prepared statements (already implemented)
- Implement rate limiting for production
- Set up monitoring and alerting
- Regular security audits
- Use strong, unique passwords for each environment

