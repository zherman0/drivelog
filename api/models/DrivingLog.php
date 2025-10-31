<?php
/**
 * DrivingLog Model
 */

class DrivingLog {
    private $conn;
    private $table_name = "driving_log";

    public $log_id;
    public $user_id;
    public $start_time;
    public $end_time;
    public $description;
    public $is_nighttime;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create new driving log entry
     */
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                  (user_id, start_time, end_time, description, is_nighttime)
                  VALUES (:user_id, :start_time, :end_time, :description, :is_nighttime)";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->start_time = htmlspecialchars(strip_tags($this->start_time));
        $this->end_time = htmlspecialchars(strip_tags($this->end_time));
        $this->description = htmlspecialchars(strip_tags($this->description));

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":start_time", $this->start_time);
        $stmt->bindParam(":end_time", $this->end_time);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":is_nighttime", $this->is_nighttime, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $this->log_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    /**
     * Get all logs for a user
     */
    public function getByUserId($user_id, $limit = 100, $offset = 0) {
        $query = "SELECT log_id, user_id, start_time, end_time, description, is_nighttime, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE user_id = :user_id
                  ORDER BY start_time DESC
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindParam(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get a single log by ID
     */
    public function getById($log_id) {
        $query = "SELECT log_id, user_id, start_time, end_time, description, is_nighttime, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE log_id = :log_id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":log_id", $log_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->log_id = $row['log_id'];
            $this->user_id = $row['user_id'];
            $this->start_time = $row['start_time'];
            $this->end_time = $row['end_time'];
            $this->description = $row['description'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return $row;
        }

        return null;
    }

    /**
     * Update driving log
     */
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET start_time = :start_time,
                      end_time = :end_time,
                      description = :description,
                      is_nighttime = :is_nighttime
                  WHERE log_id = :log_id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->start_time = htmlspecialchars(strip_tags($this->start_time));
        $this->end_time = htmlspecialchars(strip_tags($this->end_time));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->log_id = htmlspecialchars(strip_tags($this->log_id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Bind values
        $stmt->bindParam(":start_time", $this->start_time);
        $stmt->bindParam(":end_time", $this->end_time);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":is_nighttime", $this->is_nighttime, PDO::PARAM_BOOL);
        $stmt->bindParam(":log_id", $this->log_id);
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    /**
     * Delete driving log
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE log_id = :log_id AND user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        
        $this->log_id = htmlspecialchars(strip_tags($this->log_id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        
        $stmt->bindParam(":log_id", $this->log_id);
        $stmt->bindParam(":user_id", $this->user_id);

        return $stmt->execute();
    }

    /**
     * Get logs by date range
     */
    public function getByDateRange($user_id, $start_date, $end_date) {
        $query = "SELECT log_id, user_id, start_time, end_time, description, is_nighttime, created_at, updated_at
                  FROM " . $this->table_name . "
                  WHERE user_id = :user_id
                    AND start_time >= :start_date
                    AND start_time <= :end_date
                  ORDER BY start_time DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":start_date", $start_date);
        $stmt->bindParam(":end_date", $end_date);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get total driving time for user
     */
    public function getTotalDrivingTime($user_id) {
        $query = "SELECT SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)) as total_minutes
                  FROM " . $this->table_name . "
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_minutes'] ?? 0;
    }

    /**
     * Count logs for user
     */
    public function countByUserId($user_id) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name . " WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
}
?>

