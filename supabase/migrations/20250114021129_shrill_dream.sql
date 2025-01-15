/*
  # Reset Database Data
  
  1. Changes
    - Truncate all tables while preserving schema
    - Reset sequences
    - Maintain referential integrity
*/

-- Disable triggers temporarily
ALTER TABLE users DISABLE TRIGGER ALL;
ALTER TABLE clinic_settings DISABLE TRIGGER ALL;
ALTER TABLE doctors DISABLE TRIGGER ALL;
ALTER TABLE appointments DISABLE TRIGGER ALL;
ALTER TABLE reviews DISABLE TRIGGER ALL;

-- Truncate all tables in correct order to handle foreign key constraints
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE doctors CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE clinic_settings CASCADE;

-- Re-enable triggers
ALTER TABLE reviews ENABLE TRIGGER ALL;
ALTER TABLE appointments ENABLE TRIGGER ALL;
ALTER TABLE doctors ENABLE TRIGGER ALL;
ALTER TABLE users ENABLE TRIGGER ALL;
ALTER TABLE clinic_settings ENABLE TRIGGER ALL;