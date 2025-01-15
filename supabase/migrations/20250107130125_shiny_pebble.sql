-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to users" ON users;
DROP POLICY IF EXISTS "Allow public login" ON users;

-- Make clinic_code NOT NULL and add index
ALTER TABLE clinic_settings 
ALTER COLUMN clinic_code SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_clinic_settings_clinic_code 
ON clinic_settings(clinic_code);

-- Create new policies for clinic_settings
CREATE POLICY "Allow public access to clinic_settings"
  ON clinic_settings FOR SELECT
  USING (true);

-- Create new policies for users
CREATE POLICY "Allow access to users"
  ON users FOR SELECT
  USING (true);

-- Ensure all existing clinics have codes
UPDATE clinic_settings
SET clinic_code = 'CLINIC' || LPAD(id::text, 3, '0')
WHERE clinic_code IS NULL;