-- Drop existing policies
DROP POLICY IF EXISTS "Allow public access to clinic_settings" ON clinic_settings;
DROP POLICY IF EXISTS "Users view own clinic" ON clinic_settings;
DROP POLICY IF EXISTS "Super admin manage clinics" ON clinic_settings;

-- Create new RLS policies for clinic_settings
CREATE POLICY "Enable read access for authenticated users"
  ON clinic_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users"
  ON clinic_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON clinic_settings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON clinic_settings FOR DELETE
  TO authenticated
  USING (true);

-- Ensure clinic_code is required and unique
ALTER TABLE clinic_settings
  ALTER COLUMN clinic_code SET NOT NULL,
  ADD CONSTRAINT clinic_code_unique UNIQUE (clinic_code);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clinic_settings_clinic_code 
ON clinic_settings(clinic_code);