-- Drop all existing policies from users table
DROP POLICY IF EXISTS "Allow access to users" ON users;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON users;

-- Drop all existing policies from clinic_settings table
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON clinic_settings;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON clinic_settings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON clinic_settings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON clinic_settings;

-- Create new open policies for authentication
CREATE POLICY "Allow all access to users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to clinic_settings"
  ON clinic_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ensure tables still have RLS enabled but with open policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;