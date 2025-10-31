-- Add nighttime driving column to driving_log table
-- This tracks whether the driving session was at night (true) or day (false)

ALTER TABLE driving_log 
ADD COLUMN is_nighttime BOOLEAN NOT NULL DEFAULT FALSE
COMMENT 'Indicates if driving session was at night';

-- Optional: Add an index if you plan to filter by nighttime driving often
CREATE INDEX idx_nighttime ON driving_log(is_nighttime);

