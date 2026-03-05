import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, metadata } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Konten tidak valid atau kosong.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Konfigurasi Supabase tidak ditemukan di server.' }, { status: 500 });
    }
    
    // Inisialisasi Supabase menggunakan Service Role Key agar punya hak tulis mem-bypass RLS tabel
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Langkah 1: Ubah teks menjadi Vector Embedding melalui Google AI (Gemini)
    const { embedding } = await embed({
      model: google.textEmbeddingModel('gemini-embedding-001'),
      value: content,
    });

    // Langkah 2: Simpan teks dan vektor ke PostgreSQL database (Supabase - pgvector)
    const { error } = await supabase.from('documents').insert({
      content,
      metadata: metadata || {},
      embedding,
    });

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan ke database Supabase.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Berhasil mengunggah dokumen knowledge base.' });

  } catch (error: any) {
    console.error('API Ingest Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
