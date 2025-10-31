<?php
/**
 * Driving Log Routes
 * GET    /api/logs - Get all logs for authenticated user
 * POST   /api/logs - Create new log
 * GET    /api/logs/:id - Get specific log
 * PUT    /api/logs/:id - Update log
 * DELETE /api/logs/:id - Delete log
 */

require_once __DIR__ . '/../models/DrivingLog.php';
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
$drivingLog = new DrivingLog($db);

$log_id = $id;
$user_id = $payload['user_id'];

switch ($method) {
    case 'GET':
        if ($log_id) {
            // Get specific log
            $log = $drivingLog->getById($log_id);
            
            if (!$log) {
                Response::notFound('Log not found');
            }
            
            // Verify log belongs to user
            if ($log['user_id'] != $user_id) {
                Response::error('Forbidden', 403);
            }
            
            Response::success($log);
        } else {
            // Get all logs for user with pagination
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
            $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
            
            // Optional date range filter
            if (isset($_GET['start_date']) && isset($_GET['end_date'])) {
                $logs = $drivingLog->getByDateRange($user_id, $_GET['start_date'], $_GET['end_date']);
            } else {
                $logs = $drivingLog->getByUserId($user_id, $limit, $offset);
            }
            
            $total = $drivingLog->countByUserId($user_id);
            $totalMinutes = $drivingLog->getTotalDrivingTime($user_id);
            
            Response::success([
                'logs' => $logs,
                'pagination' => [
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset
                ],
                'stats' => [
                    'total_logs' => $total,
                    'total_driving_minutes' => $totalMinutes,
                    'total_driving_hours' => round($totalMinutes / 60, 2)
                ]
            ]);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validate required fields
        if (empty($data['start_time']) || empty($data['end_time'])) {
            Response::error('Start time and end time are required', 400);
        }
        
        // Validate time order
        $start = strtotime($data['start_time']);
        $end = strtotime($data['end_time']);
        
        if ($start >= $end) {
            Response::error('End time must be after start time', 400);
        }
        
        $drivingLog->user_id = $user_id;
        $drivingLog->start_time = $data['start_time'];
        $drivingLog->end_time = $data['end_time'];
        $drivingLog->description = $data['description'] ?? '';
        $drivingLog->is_nighttime = isset($data['is_nighttime']) ? (bool)$data['is_nighttime'] : false;
        
        if ($drivingLog->create()) {
            $log = $drivingLog->getById($drivingLog->log_id);
            Response::success($log, 'Log created successfully', 201);
        } else {
            Response::serverError('Failed to create log');
        }
        break;
        
    case 'PUT':
        if (!$log_id) {
            Response::error('Log ID is required', 400);
        }
        
        // Check if log exists and belongs to user
        $existingLog = $drivingLog->getById($log_id);
        
        if (!$existingLog) {
            Response::notFound('Log not found');
        }
        
        if ($existingLog['user_id'] != $user_id) {
            Response::error('Forbidden', 403);
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validate time order if both times are provided
        if (isset($data['start_time']) && isset($data['end_time'])) {
            $start = strtotime($data['start_time']);
            $end = strtotime($data['end_time']);
            
            if ($start >= $end) {
                Response::error('End time must be after start time', 400);
            }
        }
        
        $drivingLog->log_id = $log_id;
        $drivingLog->user_id = $user_id;
        $drivingLog->start_time = $data['start_time'] ?? $existingLog['start_time'];
        $drivingLog->end_time = $data['end_time'] ?? $existingLog['end_time'];
        $drivingLog->description = $data['description'] ?? $existingLog['description'];
        $drivingLog->is_nighttime = isset($data['is_nighttime']) ? (bool)$data['is_nighttime'] : (bool)$existingLog['is_nighttime'];
        
        if ($drivingLog->update()) {
            $log = $drivingLog->getById($log_id);
            Response::success($log, 'Log updated successfully');
        } else {
            Response::serverError('Failed to update log');
        }
        break;
        
    case 'DELETE':
        if (!$log_id) {
            Response::error('Log ID is required', 400);
        }
        
        // Check if log exists and belongs to user
        $existingLog = $drivingLog->getById($log_id);
        
        if (!$existingLog) {
            Response::notFound('Log not found');
        }
        
        if ($existingLog['user_id'] != $user_id) {
            Response::error('Forbidden', 403);
        }
        
        $drivingLog->log_id = $log_id;
        $drivingLog->user_id = $user_id;
        
        if ($drivingLog->delete()) {
            Response::success(null, 'Log deleted successfully');
        } else {
            Response::serverError('Failed to delete log');
        }
        break;
        
    default:
        Response::error('Method not allowed', 405);
}
?>

