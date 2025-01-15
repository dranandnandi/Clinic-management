-- Drop existing policies on doctors table
DROP POLICY IF EXISTS "View clinic doctors" ON doctors;

-- Create new RLS policies for doctors table
CREATE POLICY "Enable read access for users in same clinic"
  ON doctors FOR SELECT
  TO authenticated
  USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Enable insert access for users in same clinic"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Enable update access for users in same clinic"
  ON doctors FOR UPDATE
  TO authenticated
  USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Enable delete access for users in same clinic"
  ON doctors FOR DELETE
  TO authenticated
  USING (clinic_id IN (
    SELECT clinic_id FROM users WHERE id = auth.uid()
  ));