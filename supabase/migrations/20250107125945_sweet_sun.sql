-- Add clinic_code column to clinic_settings
ALTER TABLE clinic_settings
ADD COLUMN IF NOT EXISTS clinic_code text UNIQUE;

-- Update existing clinics with a default code
UPDATE clinic_settings
SET clinic_code = 'CLINIC' || id::text
WHERE clinic_code IS NULL;