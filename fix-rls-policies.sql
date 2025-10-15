-- Fix RLS Policies per permettere agli admin di gestire le auto

-- Drop existing policies for cars table
DROP POLICY IF EXISTS "Allow public read access to cars" ON cars;
DROP POLICY IF EXISTS "Allow admin full access to cars" ON cars;
DROP POLICY IF EXISTS "Allow authenticated users to read cars" ON cars;
DROP POLICY IF EXISTS "Allow admin to insert cars" ON cars;
DROP POLICY IF EXISTS "Allow admin to update cars" ON cars;
DROP POLICY IF EXISTS "Allow admin to delete cars" ON cars;

-- Enable RLS on cars table
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can read cars (public access)
CREATE POLICY "Public can read cars"
ON cars
FOR SELECT
TO public
USING (true);

-- Policy 2: Authenticated users can read cars
CREATE POLICY "Authenticated users can read cars"
ON cars
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Admin can insert cars
CREATE POLICY "Admin can insert cars"
ON cars
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 4: Admin can update cars
CREATE POLICY "Admin can update cars"
ON cars
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 5: Admin can delete cars
CREATE POLICY "Admin can delete cars"
ON cars
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'cars';

