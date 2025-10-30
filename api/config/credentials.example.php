<?php
/**
 * Credentials Template
 * 
 * Copy this file to credentials.php and fill in your actual values.
 * The credentials.php file is gitignored and will not be committed.
 */

return [
    // Database credentials
    'db_host' => 'localhost',
    'db_name' => 'drivelog',
    'db_username' => 'your_database_username',
    'db_password' => 'your_database_password',
    
    // Security keys - CHANGE THESE IN PRODUCTION
    'jwt_secret_key' => 'your-secret-key-change-this-in-production',
    'password_pepper' => 'your-pepper-string-change-this-in-production',
    
    // CORS settings
    'allowed_origin' => 'http://localhost:5173', // Your React app URL
];
?>

