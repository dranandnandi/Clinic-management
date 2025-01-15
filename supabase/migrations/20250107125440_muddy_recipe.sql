-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text CHECK (role IN ('super_admin', 'admin', 'receptionist')) NOT NULL,
  clinic_id uuid REFERENCES clinic_settings(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Enable read for authenticated users'
  ) THEN
    CREATE POLICY "Enable read for authenticated users"
      ON users FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Insert super admin user if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'superadmin'
  ) THEN
    INSERT INTO users (username, password, name, role)
    VALUES (
      'superadmin',
      'admin123',
      'Super Admin',
      'super_admin'
    );
  END IF;
END $$;