-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Italia',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  seats INTEGER NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('Manuale', 'Automatico')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Benzina', 'Diesel', 'Elettrico', 'Ibrido')),
  image_url TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  features TEXT[] DEFAULT '{}',
  description TEXT NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_intent_id TEXT,
  contract_url TEXT
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('license', 'id_card', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  verified BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies (FIXED: removed recursive policies)
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cars policies (FIXED: allow public read access)
CREATE POLICY "Public can view all cars" ON cars
  FOR SELECT USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update documents" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cars_for_sale table (if not exists)
CREATE TABLE IF NOT EXISTS cars_for_sale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  image_url TEXT,
  images TEXT[],
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for documents (public for easier access with RLS protection)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Storage policies for documents
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true);

-- Storage policies for car images
CREATE POLICY "Anyone can view car images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Admins can upload car images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'car-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nuovo Utente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample cars
INSERT INTO cars (brand, model, year, category, price_per_day, seats, transmission, fuel_type, image_url, description, features) VALUES
('Fiat', '500', 2023, 'Utilitaria', 35.00, 4, 'Manuale', 'Benzina', '/cars/fiat-500.jpg', 'Compatta e perfetta per la città', ARRAY['Aria condizionata', 'Bluetooth', 'USB']),
('Volkswagen', 'Golf', 2023, 'Compatta', 45.00, 5, 'Manuale', 'Diesel', '/cars/vw-golf.jpg', 'Affidabile e spaziosa', ARRAY['Aria condizionata', 'Cruise control', 'Bluetooth']),
('BMW', 'Serie 3', 2024, 'Berlina', 85.00, 5, 'Automatico', 'Diesel', '/cars/bmw-3.jpg', 'Eleganza e prestazioni', ARRAY['Navigatore', 'Sedili in pelle', 'Sensori parcheggio']),
('Mercedes', 'Classe A', 2024, 'Compatta Premium', 75.00, 5, 'Automatico', 'Benzina', '/cars/mercedes-a.jpg', 'Comfort e tecnologia', ARRAY['MBUX', 'LED', 'Keyless']),
('Tesla', 'Model 3', 2024, 'Elettrica', 95.00, 5, 'Automatico', 'Elettrico', '/cars/tesla-3.jpg', 'Il futuro della mobilità', ARRAY['Autopilot', 'Supercharger', 'Premium audio']),
('Renault', 'Clio', 2023, 'Utilitaria', 38.00, 5, 'Manuale', 'Benzina', '/cars/renault-clio.jpg', 'Economica e versatile', ARRAY['Aria condizionata', 'Bluetooth']),
('Audi', 'A4', 2024, 'Berlina', 90.00, 5, 'Automatico', 'Diesel', '/cars/audi-a4.jpg', 'Tecnologia e design', ARRAY['Virtual cockpit', 'Matrix LED', 'Quattro']),
('Ford', 'Puma', 2023, 'SUV Compatto', 55.00, 5, 'Manuale', 'Ibrido', '/cars/ford-puma.jpg', 'SUV compatto e moderno', ARRAY['Retrocamera', 'Sensori', 'Cruise control']);

