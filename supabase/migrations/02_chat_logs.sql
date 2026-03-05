-- Buat tabel untuk menyimpan log percakapan chat
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buat index untuk mempercepat pencarian berdasarkan session_id dan created_at
CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON public.chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs(created_at DESC);

-- Set Row Level Security (RLS)
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- Policy agar Service Role dapat melakukan write (insert) dan read
CREATE POLICY "Service Role Full Access" ON public.chat_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policy untuk admin panel (jika nantinya admin memakai auth reguler, tapi saat ini kita hanya pakai service_role)
-- Untuk keamanan, hanya service_role yang bisa akses tabel ini. Klien anonim tidak bisa baca/tulis langsung.
