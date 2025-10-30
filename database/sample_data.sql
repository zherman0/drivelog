-- Sample data for testing

USE drivelog;

-- Insert sample users
-- Note: These are sample password hashes (bcrypt format). In production, generate these properly with your salt and pepper.
-- Sample passwords are all 'password123' for testing purposes
INSERT INTO user (username, email, password_hash, name, birthdate) VALUES
('johndoe', 'john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe', '1990-05-15'),
('janesmith', 'jane.smith@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Smith', '1985-08-22'),
('mikejohnson', 'mike.johnson@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike Johnson', '1992-03-10');

-- Insert sample driving logs
INSERT INTO driving_log (user_id, start_time, end_time, description) VALUES
(1, '2025-10-28 08:00:00', '2025-10-28 08:30:00', 'Morning commute to work'),
(1, '2025-10-28 17:00:00', '2025-10-28 17:45:00', 'Evening commute home'),
(2, '2025-10-29 09:00:00', '2025-10-29 10:30:00', 'Trip to the grocery store'),
(2, '2025-10-29 14:00:00', '2025-10-29 15:15:00', 'Driving practice on highway'),
(3, '2025-10-30 07:30:00', '2025-10-30 08:15:00', 'School drop-off and errands');

