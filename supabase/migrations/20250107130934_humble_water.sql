-- Create or replace the password verification function
CREATE OR REPLACE FUNCTION verify_user_password(
  username text,
  password text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE users.username = verify_user_password.username
    AND users.password = crypt(verify_user_password.password, users.password)
  );
END
$$;