-- Create real_estates table
CREATE TABLE IF NOT EXISTS real_estates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  size TEXT,
  price TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_real_estates_status ON real_estates(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_real_estates_created_at ON real_estates(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE real_estates ENABLE ROW LEVEL SECURITY;

-- Create policies for real_estates
-- Allow public read access
CREATE POLICY "Allow public read access" ON real_estates
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON real_estates
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON real_estates
  FOR UPDATE USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON real_estates
  FOR DELETE USING (true);
