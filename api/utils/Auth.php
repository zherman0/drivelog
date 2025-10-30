<?php
/**
 * Authentication and Authorization Utilities
 */

require_once __DIR__ . '/../config/config.php';

class Auth {
    
    /**
     * Hash password with salt and pepper
     */
    public static function hashPassword($password) {
        // Add pepper to password before hashing
        $peppered = hash_hmac('sha256', $password, PASSWORD_PEPPER);
        
        // Use bcrypt with auto-generated salt
        return password_hash($peppered, PASSWORD_BCRYPT);
    }
    
    /**
     * Verify password against hash
     */
    public static function verifyPassword($password, $hash) {
        // Add pepper to password before verification
        $peppered = hash_hmac('sha256', $password, PASSWORD_PEPPER);
        
        return password_verify($peppered, $hash);
    }
    
    /**
     * Generate JWT token
     */
    public static function generateToken($user_id, $username) {
        $issued_at = time();
        $expiration = $issued_at + JWT_EXPIRATION;
        
        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration,
            'user_id' => $user_id,
            'username' => $username
        ];
        
        return self::encode($payload);
    }
    
    /**
     * Validate JWT token and return payload
     */
    public static function validateToken($token) {
        try {
            $payload = self::decode($token);
            
            // Check if token is expired
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return null;
            }
            
            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }
    
    /**
     * Get bearer token from authorization header
     */
    public static function getBearerToken() {
        $headers = self::getAuthorizationHeader();
        
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    /**
     * Get authorization header
     */
    private static function getAuthorizationHeader() {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }
    
    /**
     * Simple JWT encode (using base64)
     * For production, consider using a library like firebase/php-jwt
     */
    private static function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => JWT_ALGORITHM]);
        $payload = json_encode($payload);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    /**
     * Simple JWT decode
     */
    private static function decode($jwt) {
        $parts = explode('.', $jwt);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
        $base64UrlSignatureCheck = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($base64UrlSignature !== $base64UrlSignatureCheck) {
            throw new Exception('Invalid signature');
        }
        
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload));
        return json_decode($payload, true);
    }
}
?>

