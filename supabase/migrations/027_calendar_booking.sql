-- 027_calendar_booking.sql

-- Add display_name to calendar_accounts for custom labeling
ALTER TABLE calendar_accounts ADD COLUMN IF NOT EXISTS display_name TEXT;

-- ============================================================
-- Booking Links
-- ============================================================

CREATE TABLE IF NOT EXISTS booking_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_account_id UUID REFERENCES calendar_accounts(id) ON DELETE CASCADE,

  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,

  -- Days/hours/buffer rules
  availability_rules JSONB DEFAULT '{}',

  is_active BOOLEAN DEFAULT true,
  requires_confirmation BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Bookings (guests who booked through a link)
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_link_id UUID REFERENCES booking_links(id) ON DELETE CASCADE,
  calendar_account_id UUID REFERENCES calendar_accounts(id),

  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_notes TEXT,

  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  timezone TEXT NOT NULL,

  status TEXT DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled', 'completed'

  calendar_event_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_booking_links_slug ON booking_links(slug);
CREATE INDEX IF NOT EXISTS idx_bookings_link ON bookings(booking_link_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- RLS
ALTER TABLE booking_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON booking_links FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON bookings FOR ALL USING (true);
