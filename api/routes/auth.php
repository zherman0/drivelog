<?php
/**
 * Authentication Routes
 * POST /api/auth/register - Register new user
 * POST /api/auth/login - Login user
 * POST /api/auth/verify - Verify token
 */

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Auth.php';

$database = new Database();
$db = $database->getConnection();

$action = $parts[1] ?? '';

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        switch ($action) {
            case 'register':
                // Validate required fields
                if (empty($data['username']) || empty($data['email']) || 
                    empty($data['password']) || empty($data['name']) || 
                    empty($data['birthdate'])) {
                    Response::error('Missing required fields', 400);
                }
                
                // Validate email format
                if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                    Response::error('Invalid email format', 400);
                }
                
                // Validate password strength
                if (strlen($data['password']) < 8) {
                    Response::error('Password must be at least 8 characters', 400);
                }
                
                $user = new User($db);
                
                // Check if username exists
                if ($user->usernameExists($data['username'])) {
                    Response::error('Username already exists', 400);
                }
                
                // Check if email exists
                if ($user->emailExists($data['email'])) {
                    Response::error('Email already exists', 400);
                }
                
                // Set user properties
                $user->username = $data['username'];
                $user->email = $data['email'];
                $user->password_hash = $data['password']; // Will be hashed in model
                $user->name = $data['name'];
                $user->birthdate = $data['birthdate'];
                
                // Create user
                if ($user->create()) {
                    $token = Auth::generateToken($user->user_id, $user->username);
                    
                    Response::success([
                        'token' => $token,
                        'user' => $user->toArray()
                    ], 'User registered successfully', 201);
                } else {
                    Response::serverError('Failed to create user');
                }
                break;
                
            case 'login':
                // Validate required fields
                if (empty($data['username']) || empty($data['password'])) {
                    Response::error('Username and password are required', 400);
                }
                
                $user = new User($db);
                
                // Find user by username
                if (!$user->findByUsername($data['username'])) {
                    Response::error('Invalid credentials', 401);
                }
                
                // Verify password
                if (!Auth::verifyPassword($data['password'], $user->password_hash)) {
                    Response::error('Invalid credentials', 401);
                }
                
                // Generate token
                $token = Auth::generateToken($user->user_id, $user->username);
                
                Response::success([
                    'token' => $token,
                    'user' => $user->toArray()
                ], 'Login successful');
                break;
                
            case 'verify':
                $token = Auth::getBearerToken();
                
                if (!$token) {
                    Response::unauthorized('No token provided');
                }
                
                $payload = Auth::validateToken($token);
                
                if (!$payload) {
                    Response::unauthorized('Invalid or expired token');
                }
                
                Response::success([
                    'valid' => true,
                    'user_id' => $payload['user_id'],
                    'username' => $payload['username']
                ]);
                break;
                
            default:
                Response::notFound('Auth endpoint not found');
        }
        break;
        
    default:
        Response::error('Method not allowed', 405);
}
?>

