<?php
/**
 * DriveLog REST API Entry Point
 * Handles routing and CORS
 */

// CORS headers - must be before any other output
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    http_response_code(200);
    exit(0);
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path if API is in a subdirectory
$base_path = '/driveapi';
if (strpos($uri, $base_path) === 0) {
    $uri = substr($uri, strlen($base_path));
}

// Remove trailing slash
$uri = rtrim($uri, '/');

// Parse route
$parts = explode('/', trim($uri, '/'));
$endpoint = $parts[0] ?? '';
$id = $parts[1] ?? null;
$subendpoint = $parts[2] ?? null;

// Route requests
try {
    switch ($endpoint) {
        case 'auth':
            require __DIR__ . '/routes/auth.php';
            break;
            
        case 'users':
            // Check for password subendpoint
            if ($id && $subendpoint === 'password') {
                require __DIR__ . '/routes/password.php';
            } else {
                require __DIR__ . '/routes/users.php';
            }
            break;
            
        case 'logs':
            require __DIR__ . '/routes/logs.php';
            break;
            
        case 'health':
            Response::success(['status' => 'ok', 'timestamp' => time()]);
            break;
            
        default:
            Response::notFound('Endpoint not found');
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    Response::serverError($e->getMessage());
}
?>

