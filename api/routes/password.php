<?php
/**
 * Password Change Route
 * PUT /api/users/:id/password - Update user password
 */

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Auth.php';

// Only allow PUT method
if ($method !== 'PUT') {
    Response::error('Method not allowed', 405);
}

// Authenticate user
$token = Auth::getBearerToken();
if (!$token) {
    Response::unauthorized('Authentication required');
}

$payload = Auth::validateToken($token);
if (!$payload) {
    Response::unauthorized('Invalid or expired token');
}

$user_id = $id;

if (!$user_id) {
    Response::error('User ID is required', 400);
}

// Users can only update their own password
if ($payload['user_id'] != $user_id) {
    Response::error('Forbidden', 403);
}

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($data['current_password']) || !isset($data['new_password'])) {
    Response::error('Current password and new password are required', 400);
}

// Validate new password strength
$new_password = $data['new_password'];
if (strlen($new_password) < 8) {
    Response::error('New password must be at least 8 characters long', 400);
}

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get user with password hash
if (!$user->findByUsername($payload['username'])) {
    Response::notFound('User not found');
}

// Verify current password
if (!$user->verifyPassword($data['current_password'])) {
    Response::error('Current password is incorrect', 400);
}

// Update to new password
$user->user_id = $user_id;
if ($user->updatePassword($new_password)) {
    Response::success(null, 'Password updated successfully');
} else {
    Response::serverError('Failed to update password');
}
?>

