<?php
/**
 * User Model
 */

require_once __DIR__ . '/../utils/Auth.php';

class User {
    private $conn;
    private $table_name = "user";

    public $user_id;
    public $username;
    public $email;
    public $password_hash;
    public $name;
    public $birthdate;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create new user
     */
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  (username, email, password_hash, name, birthdate)
                  VALUES (:username, :email, :password_hash, :name, :birthdate)";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->birthdate = htmlspecialchars(strip_tags($this->birthdate));

        // Hash password with salt and pepper
        $hashed_password = Auth::hashPassword($this->password_hash);

        // Bind values
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password_hash", $hashed_password);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":birthdate", $this->birthdate);

        if ($stmt->execute()) {
            $this->user_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    /**
     * Find user by username
     */
    public function findByUsername($username) {
        $query = "SELECT user_id, username, email, password_hash, name, birthdate, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE username = :username
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->user_id = $row['user_id'];
            $this->username = $row['username'];
            $this->email = $row['email'];
            $this->password_hash = $row['password_hash'];
            $this->name = $row['name'];
            $this->birthdate = $row['birthdate'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    /**
     * Find user by email
     */
    public function findByEmail($email) {
        $query = "SELECT user_id, username, email, password_hash, name, birthdate, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE email = :email
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->user_id = $row['user_id'];
            $this->username = $row['username'];
            $this->email = $row['email'];
            $this->password_hash = $row['password_hash'];
            $this->name = $row['name'];
            $this->birthdate = $row['birthdate'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    /**
     * Find user by ID
     */
    public function findById($user_id) {
        $query = "SELECT user_id, username, email, name, birthdate, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE user_id = :user_id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return $row;
        }

        return null;
    }

    /**
     * Update user
     */
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name = :name,
                      email = :email,
                      birthdate = :birthdate
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->birthdate = htmlspecialchars(strip_tags($this->birthdate));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":birthdate", $this->birthdate);
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    /**
     * Update password
     */
    public function updatePassword($new_password) {
        $query = "UPDATE " . $this->table_name . "
                  SET password_hash = :password_hash
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Hash the new password
        $hashed_password = Auth::hashPassword($new_password);

        // Sanitize
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Bind values
        $stmt->bindParam(":password_hash", $hashed_password);
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    /**
     * Verify password
     */
    public function verifyPassword($password) {
        if (!$this->password_hash) {
            return false;
        }
        return Auth::verifyPassword($password, $this->password_hash);
    }

    /**
     * Delete user
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    /**
     * Check if username exists
     */
    public function usernameExists($username) {
        $query = "SELECT user_id FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Check if email exists
     */
    public function emailExists($email) {
        $query = "SELECT user_id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Get user data without sensitive information
     */
    public function toArray($includePassword = false) {
        $data = [
            'user_id' => $this->user_id,
            'username' => $this->username,
            'email' => $this->email,
            'name' => $this->name,
            'birthdate' => $this->birthdate,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];

        if ($includePassword) {
            $data['password_hash'] = $this->password_hash;
        }

        return $data;
    }
}
?>

