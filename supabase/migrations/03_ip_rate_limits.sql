-- Migration: 03_ip_rate_limits.sql
-- Tabel untuk membatasi jumlah chat per IP address (maks 5 pesan)

CREATE TABLE IF NOT EXISTS ip_rate_limits (
  ip_address   TEXT PRIMARY KEY,
  message_count INTEGER NOT NULL DEFAULT 0,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index untuk mempercepat lookup berdasarkan IP
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_ip
  ON ip_rate_limits (ip_address);

-- Aktifkan Row Level Security
ALTER TABLE ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- Hanya service_role yang boleh read/write tabel ini
-- (tidak ada akses publik)
CREATE POLICY "service_role_only"
  ON ip_rate_limits
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Komentar tabel
COMMENT ON TABLE ip_rate_limits IS
  'Menyimpan jumlah pesan chat per IP address untuk mencegah spam. Maks 5 pesan per IP.';

COMMENT ON COLUMN ip_rate_limits.ip_address    IS 'IP address client (dari header x-forwarded-for / x-real-ip)';
COMMENT ON COLUMN ip_rate_limits.message_count IS 'Total pesan yang sudah dikirim dari IP ini';
COMMENT ON COLUMN ip_rate_limits.first_seen_at IS 'Waktu pertama kali IP ini mengirim pesan';
COMMENT ON COLUMN ip_rate_limits.updated_at    IS 'Waktu terakhir IP ini mengirim pesan';
