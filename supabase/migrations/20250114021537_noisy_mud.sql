/*
  # Add Test Data

  1. Insert test clinic
  2. Insert admin user
  3. Insert sample doctors
  4. Insert sample appointments and reviews
*/

-- Insert test clinic
INSERT INTO clinic_settings (name, address, gmb_link, clinic_code)
VALUES (
  'Test Medical Center',
  '123 Test Street, Medical District',
  'https://g.page/test-medical',
  'TEST001'
);

-- Insert admin user with password: Test123!
INSERT INTO users (username, password, name, role, clinic_id)
VALUES (
  'testadmin',
  crypt('Test123!', gen_salt('bf')),
  'Test Admin',
  'admin',
  (SELECT id FROM clinic_settings WHERE clinic_code = 'TEST001')
);

-- Insert sample doctors
INSERT INTO doctors (name, specialization, clinic_id)
VALUES 
  ('Dr. John Smith', 'General Medicine', (SELECT id FROM clinic_settings WHERE clinic_code = 'TEST001')),
  ('Dr. Jane Doe', 'Pediatrics', (SELECT id FROM clinic_settings WHERE clinic_code = 'TEST001')),
  ('Dr. Robert Wilson', 'Cardiology', (SELECT id FROM clinic_settings WHERE clinic_code = 'TEST001'));

-- Insert sample appointments
INSERT INTO appointments (
  patient_name,
  doctor_id,
  appointment_date,
  appointment_time,
  contact_number,
  status,
  notes,
  clinic_id
)
SELECT 
  'Test Patient ' || n,
  doctor_id,
  CURRENT_DATE + (n || ' days')::interval,
  '09:00'::time + (n || ' hours')::interval,
  '9876543210',
  'pending',
  'Test appointment ' || n,
  clinic_id
FROM 
  generate_series(1, 3) n,
  (SELECT id as doctor_id, clinic_id FROM doctors ORDER BY random() LIMIT 1) d;