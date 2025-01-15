/*
  # Add 20 clinics with admin users

  1. New Data
    - Adds 20 new clinics with unique clinic codes
    - Creates admin users for each clinic with secure credentials
*/

-- Insert clinics
INSERT INTO clinic_settings (name, address, gmb_link, clinic_code)
VALUES 
  ('North Medical Center', '123 North Ave, City', 'https://g.page/north-med', 'CLINIC001'),
  ('South Health Hub', '456 South St, City', 'https://g.page/south-health', 'CLINIC002'),
  ('East Care Clinic', '789 East Rd, City', 'https://g.page/east-care', 'CLINIC003'),
  ('West Medical', '321 West Blvd, City', 'https://g.page/west-med', 'CLINIC004'),
  ('Central Healthcare', '654 Central Ave, City', 'https://g.page/central-health', 'CLINIC005'),
  ('Care Plus Center', '987 Care St, City', 'https://g.page/care-plus', 'CLINIC006'),
  ('Health First', '147 Health Ave, City', 'https://g.page/health-first', 'CLINIC007'),
  ('MedCare Center', '258 Med Rd, City', 'https://g.page/medcare', 'CLINIC008'),
  ('City Medical Hub', '369 City Blvd, City', 'https://g.page/city-med', 'CLINIC009'),
  ('DocCare Clinic', '741 Doc St, City', 'https://g.page/doccare', 'CLINIC010'),
  ('Care Point', '852 Point Ave, City', 'https://g.page/care-point', 'CLINIC011'),
  ('Health Hub Plus', '963 Hub Rd, City', 'https://g.page/health-hub', 'CLINIC012'),
  ('MedPoint Center', '159 Med Ave, City', 'https://g.page/medpoint', 'CLINIC013'),
  ('Clinic Plus', '267 Plus St, City', 'https://g.page/clinic-plus', 'CLINIC014'),
  ('Care Center Pro', '348 Pro Rd, City', 'https://g.page/care-pro', 'CLINIC015'),
  ('Health Support', '573 Support Ave, City', 'https://g.page/health-sup', 'CLINIC016'),
  ('Med Lead Center', '684 Lead St, City', 'https://g.page/med-lead', 'CLINIC017'),
  ('Care Direct', '795 Direct Rd, City', 'https://g.page/care-direct', 'CLINIC018'),
  ('Clinic Head', '826 Head Ave, City', 'https://g.page/clinic-head', 'CLINIC019'),
  ('Health Admin Hub', '937 Admin St, City', 'https://g.page/health-admin', 'CLINIC020')
ON CONFLICT (clinic_code) DO UPDATE 
SET 
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  gmb_link = EXCLUDED.gmb_link;

-- Insert admin users for each clinic
DO $$
DECLARE
  clinic_rec RECORD;
BEGIN
  FOR clinic_rec IN SELECT id, clinic_code FROM clinic_settings WHERE clinic_code IN (
    'CLINIC001', 'CLINIC002', 'CLINIC003', 'CLINIC004', 'CLINIC005',
    'CLINIC006', 'CLINIC007', 'CLINIC008', 'CLINIC009', 'CLINIC010',
    'CLINIC011', 'CLINIC012', 'CLINIC013', 'CLINIC014', 'CLINIC015',
    'CLINIC016', 'CLINIC017', 'CLINIC018', 'CLINIC019', 'CLINIC020'
  )
  LOOP
    -- Insert admin user for each clinic
    INSERT INTO users (username, password, name, role, clinic_id)
    VALUES
      (
        CASE clinic_rec.clinic_code
          WHEN 'CLINIC001' THEN 'admin_north1'
          WHEN 'CLINIC002' THEN 'south_clinic2'
          WHEN 'CLINIC003' THEN 'east_admin3'
          WHEN 'CLINIC004' THEN 'west_clinic4'
          WHEN 'CLINIC005' THEN 'central_doc5'
          WHEN 'CLINIC006' THEN 'care_admin6'
          WHEN 'CLINIC007' THEN 'health_mgr7'
          WHEN 'CLINIC008' THEN 'med_admin8'
          WHEN 'CLINIC009' THEN 'clinic_lead9'
          WHEN 'CLINIC010' THEN 'doc_admin10'
          WHEN 'CLINIC011' THEN 'care_head11'
          WHEN 'CLINIC012' THEN 'health_dir12'
          WHEN 'CLINIC013' THEN 'med_chief13'
          WHEN 'CLINIC014' THEN 'clinic_mgr14'
          WHEN 'CLINIC015' THEN 'admin_care15'
          WHEN 'CLINIC016' THEN 'health_sup16'
          WHEN 'CLINIC017' THEN 'med_lead17'
          WHEN 'CLINIC018' THEN 'care_dir18'
          WHEN 'CLINIC019' THEN 'clinic_head19'
          WHEN 'CLINIC020' THEN 'health_admin20'
        END,
        CASE clinic_rec.clinic_code
          WHEN 'CLINIC001' THEN crypt('K9#mP2$vL5nX', gen_salt('bf'))
          WHEN 'CLINIC002' THEN crypt('R7@jN4$qW9pY', gen_salt('bf'))
          WHEN 'CLINIC003' THEN crypt('H5#xB8$mD3kL', gen_salt('bf'))
          WHEN 'CLINIC004' THEN crypt('T6@nF9$cJ4wQ', gen_salt('bf'))
          WHEN 'CLINIC005' THEN crypt('M2#pL7$vB5hN', gen_salt('bf'))
          WHEN 'CLINIC006' THEN crypt('Y8@kR4$sX9mP', gen_salt('bf'))
          WHEN 'CLINIC007' THEN crypt('G3#wQ8$nM5tB', gen_salt('bf'))
          WHEN 'CLINIC008' THEN crypt('C9@vH6$kL4xD', gen_salt('bf'))
          WHEN 'CLINIC009' THEN crypt('P5#jF2$wR7mN', gen_salt('bf'))
          WHEN 'CLINIC010' THEN crypt('B8@tM4$hX3kL', gen_salt('bf'))
          WHEN 'CLINIC011' THEN crypt('L6#nW9$cQ5vR', gen_salt('bf'))
          WHEN 'CLINIC012' THEN crypt('X4@kH7$pM2tB', gen_salt('bf'))
          WHEN 'CLINIC013' THEN crypt('D7#wL5$nF8xJ', gen_salt('bf'))
          WHEN 'CLINIC014' THEN crypt('Q2@vB6$kR4mP', gen_salt('bf'))
          WHEN 'CLINIC015' THEN crypt('N8#tX4$hM5wL', gen_salt('bf'))
          WHEN 'CLINIC016' THEN crypt('V5@jQ7$cB3kR', gen_salt('bf'))
          WHEN 'CLINIC017' THEN crypt('K3#pF8$nX6tM', gen_salt('bf'))
          WHEN 'CLINIC018' THEN crypt('W9@vL4$hD2xQ', gen_salt('bf'))
          WHEN 'CLINIC019' THEN crypt('M6#tR5$kP8wN', gen_salt('bf'))
          WHEN 'CLINIC020' THEN crypt('B4@nH7$cX5vL', gen_salt('bf'))
        END,
        'Admin ' || clinic_rec.clinic_code,
        'admin',
        clinic_rec.id
      )
    ON CONFLICT (username) 
    DO UPDATE SET
      password = EXCLUDED.password,
      name = EXCLUDED.name,
      clinic_id = EXCLUDED.clinic_id;
  END LOOP;
END $$;