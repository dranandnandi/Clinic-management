/*
  # Add Sample Data

  1. New Data
    - Sample doctors for the clinic
    - Sample appointments
    - Sample reviews

  2. Notes
    - All data is linked to the existing sample clinic
    - Uses realistic names and specializations
*/

-- Add sample doctors
INSERT INTO doctors (name, specialization, clinic_id)
VALUES 
  ('Dr. Sarah Johnson', 'General Medicine', (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001')),
  ('Dr. Michael Chen', 'Pediatrics', (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001')),
  ('Dr. Emily Williams', 'Cardiology', (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001')),
  ('Dr. James Wilson', 'Orthopedics', (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001'));

-- Add sample appointments
INSERT INTO appointments (
  patient_name,
  doctor_id,
  appointment_date,
  appointment_time,
  contact_number,
  status,
  notes,
  clinic_id,
  created_at
)
SELECT 
  patient_name,
  doctor_id,
  appointment_date,
  appointment_time,
  contact_number,
  status,
  notes,
  clinic_id,
  created_at
FROM (
  VALUES
    (
      'John Smith',
      (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1),
      CURRENT_DATE + INTERVAL '1 day',
      '09:00',
      '9876543210',
      'pending',
      'Regular checkup',
      (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001'),
      now()
    ),
    (
      'Emma Davis',
      (SELECT id FROM doctors WHERE name = 'Dr. Michael Chen' LIMIT 1),
      CURRENT_DATE + INTERVAL '2 days',
      '10:30',
      '9876543211',
      'pending',
      'Vaccination',
      (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001'),
      now()
    ),
    (
      'Robert Brown',
      (SELECT id FROM doctors WHERE name = 'Dr. Emily Williams' LIMIT 1),
      CURRENT_DATE + INTERVAL '1 day',
      '14:00',
      '9876543212',
      'pending',
      'Heart consultation',
      (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001'),
      now()
    )
) AS data(
  patient_name,
  doctor_id,
  appointment_date,
  appointment_time,
  contact_number,
  status,
  notes,
  clinic_id,
  created_at
);

-- Add sample reviews
INSERT INTO reviews (
  patient_name,
  doctor_id,
  appointment_date,
  contact_number,
  status,
  notes,
  clinic_id,
  created_at
)
SELECT 
  patient_name,
  doctor_id,
  appointment_date,
  contact_number,
  status,
  notes,
  clinic_id,
  created_at
FROM (
  VALUES
    (
      'Alice Johnson',
      (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson' LIMIT 1),
      CURRENT_DATE - INTERVAL '5 days',
      '9876543213',
      'sent',
      'General checkup',
      (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001'),
      now()
    ),
    (
      'David Wilson',
      (SELECT id FROM doctors WHERE name = 'Dr. Emily Williams' LIMIT 1),
      CURRENT_DATE - INTERVAL '3 days',
      '9876543214',
      'completed',
      'Heart checkup',
      (SELECT id FROM clinic_settings WHERE clinic_code = 'CLINIC001'),
      now()
    )
) AS data(
  patient_name,
  doctor_id,
  appointment_date,
  contact_number,
  status,
  notes,
  clinic_id,
  created_at
);