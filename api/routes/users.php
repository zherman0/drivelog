<?php
/**
 * User Routes
 * GET    /api/users/:id - Get user by ID
 * PUT    /api/users/:id - Update user
 * DELETE /api/users/:id - Delete user
 */

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Auth.php';

// Authenticate user
$token = Auth::getBearerToken();
if (!$token) {
    Response::unauthorized('Authentication required');
}

$payload = Auth::validateToken($token);
if (!$payload) {
    Response::unauthorized('Invalid or expired token');
}

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$user_id = $id;

switch ($method) {
    case 'GET':
        if (!$user_id) {
            Response::error('User ID is required', 400);
        }
        
        // Users can only access their own data
        if ($payload['user_id'] != $user_id) {
            Response::error('Forbidden', 403);
        }
        
        $userData = $user->findById($user_id);
        
        if (!$userData) {
            Response::notFound('User not found');
        }
        
        Response::success($userData);
        break;
        
    case 'PUT':
        if (!$user_id) {
            Response::error('User ID is required', 400);
        }
        
        // Users can only update their own data
        if ($payload['user_id'] != $user_id) {
            Response::error('Forbidden', 403);
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validate email if provided
        if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }
        
        // Check if email is already taken by another user
        if (isset($data['email'])) {
            $existingUser = new User($db);
            if ($existingUser->findByEmail($data['email']) && $existingUser->user_id != $user_id) {
                Response::error('Email already exists', 400);
            }
        }
        
        $user->user_id = $user_id;
        $user->name = $data['name'] ?? null;
        $user->email = $data['email'] ?? null;
        $user->birthdate = $data['birthdate'] ?? null;
        
        if ($user->update()) {
            $userData = $user->findById($user_id);
            Response::success($userData, 'User updated successfully');
        } else {
            Response::serverError('Failed to update user');
        }
        break;
        
    case 'DELETE':
        if (!$user_id) {
            Response::error('User ID is required', 400);
        }
        
        // Users can only delete their own account
        if ($payload['user_id'] != $user_id) {
            Response::error('Forbidden', 403);
        }
        
        $user->user_id = $user_id;
        
        if ($user->delete()) {
            Response::success(null, 'User deleted successfully');
        } else {
            Response::serverError('Failed to delete user');
        }
        break;
        
    default:
        Response::error('Method not allowed', 405);
}
?>

