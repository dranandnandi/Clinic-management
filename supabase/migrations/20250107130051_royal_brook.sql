-- Insert clinics with specific IDs
INSERT INTO clinic_settings (id, name, address, gmb_link, clinic_code)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Clinic 1', '123 Main St, City 1', 'https://g.page/clinic1', 'CLINIC001'),
  ('00000000-0000-0000-0000-000000000012', 'Clinic 12', '456 Oak St, City 12', 'https://g.page/clinic12', 'CLINIC012'),
  ('00000000-0000-0000-0000-000000000013', 'Clinic 13', '789 Pine St, City 13', 'https://g.page/clinic13', 'CLINIC013'),
  ('00000000-0000-0000-0000-000000000015', 'Clinic 15', '321 Elm St, City 15', 'https://g.page/clinic15', 'CLINIC015'),
  ('00000000-0000-0000-0000-000000000016', 'Clinic 16', '654 Maple St, City 16', 'https://g.page/clinic16', 'CLINIC016')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  gmb_link = EXCLUDED.gmb_link,
  clinic_code = EXCLUDED.clinic_code;

-- Create admin users for each clinic
INSERT INTO users (username, password, name, role, clinic_id)
VALUES
  ('admin1', crypt('Admin123!', gen_salt('bf')), 'Admin 1', 'admin', '00000000-0000-0000-0000-000000000001'),
  ('admin12', crypt('Admin123!', gen_salt('bf')), 'Admin 12', 'admin', '00000000-0000-0000-0000-000000000012'),
  ('admin13', crypt('Admin123!', gen_salt('bf')), 'Admin 13', 'admin', '00000000-0000-0000-0000-000000000013'),
  ('admin15', crypt('Admin123!', gen_salt('bf')), 'Admin 15', 'admin', '00000000-0000-0000-0000-000000000015'),
  ('admin16', crypt('Admin123!', gen_salt('bf')), 'Admin 16', 'admin', '00000000-0000-0000-0000-000000000016')
ON CONFLICT (username) DO UPDATE 
SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  clinic_id = EXCLUDED.clinic_id;