-- Drop existing policies on users table
DROP POLICY IF EXISTS "Enable read for authenticated users" ON users;
DROP POLICY IF EXISTS "Super admin access all" ON users;

-- Create new RLS policies for users table
CREATE POLICY "Allow public read access to users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Allow public login"
  ON users FOR SELECT
  USING (true);

-- Update super admin password if it exists
UPDATE users 
SET password = 'admin123'
WHERE username = 'superadmin';