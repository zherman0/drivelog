<?php
/**
 * Application Configuration
 */

// Load credentials from external file
$credentials = require __DIR__ . '/credentials.php';

// Security settings
define('JWT_SECRET_KEY', $credentials['jwt_secret_key']);
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 86400); // 24 hours in seconds

// Password pepper (additional security layer beyond salt)
define('PASSWORD_PEPPER', $credentials['password_pepper']);

// CORS settings
define('ALLOWED_ORIGIN', $credentials['allowed_origin']);

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Set to '0' in production
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../error_logs/php-errors.log');

// Timezone
date_default_timezone_set('UTC');
?>

