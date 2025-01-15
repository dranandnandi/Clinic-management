-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS clinic_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  gmb_link text NOT NULL,
  logo text,
  primary_color text DEFAULT '#4F46E5',
  secondary_color text DEFAULT '#E5E7EB',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  clinic_id uuid REFERENCES clinic_settings(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  contact_number text NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
  notes text,
  clinic_id uuid REFERENCES clinic_settings(id) NOT NULL,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  appointment_date date NOT NULL,
  contact_number text NOT NULL,
  status text CHECK (status IN ('sent', 'completed')) NOT NULL DEFAULT 'sent',
  notes text,
  clinic_id uuid REFERENCES clinic_settings(id) NOT NULL,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS (idempotent)
DO $$ 
BEGIN
  ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
  ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

-- Create super admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'superadmin') THEN
    INSERT INTO users (username, password, name, role)
    VALUES (
      'superadmin',
      crypt('admin123', gen_salt('bf')),
      'Super Admin',
      'super_admin'
    );
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Super admin access all" ON users;
  DROP POLICY IF EXISTS "Users view own clinic" ON clinic_settings;
  DROP POLICY IF EXISTS "Super admin manage clinics" ON clinic_settings;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

-- Create RLS policies
CREATE POLICY "Super admin access all" ON users
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));

CREATE POLICY "Users view own clinic" ON clinic_settings
  FOR SELECT TO authenticated
  USING (id IN (SELECT clinic_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Super admin manage clinics" ON clinic_settings
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'super_admin'));