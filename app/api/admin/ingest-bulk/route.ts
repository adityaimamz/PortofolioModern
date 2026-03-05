import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export const maxDuration = 120;

interface DocItem {
  content: string;
  metadata?: Record<string, any>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documents } = body as { documents: DocItem[] };

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json({ error: 'Format tidak valid. Kirimkan { "documents": [...] }' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Konfigurasi Supabase tidak ditemukan.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: { index: number; content: string; status: string; error?: string }[] = [];
    
    // Helper untuk menghindari Rate Limit
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];

      if (!doc.content || typeof doc.content !== 'string' || !doc.content.trim()) {
        results.push({ index: i, content: doc.content?.slice(0, 50) || '', status: 'skipped', error: 'Konten kosong' });
        continue;
      }

      // Beri jeda 1.5 detik untuk setiap request (kecuali yang pertama) 
      // untuk menghindari Limit 100 RPM (Requests Per Minute) pada model Embedding
      if (i > 0) {
        await delay(1500); 
      }

      try {
        // Generate embedding
        const { embedding } = await embed({
          model: google.textEmbeddingModel('gemini-embedding-001'),
          value: doc.content,
        });

        // Insert ke Supabase
        const { error } = await supabase.from('documents').insert({
          content: doc.content,
          metadata: doc.metadata || {},
          embedding,
        });

        if (error) {
          results.push({ index: i, content: doc.content.slice(0, 50), status: 'error', error: error.message });
        } else {
          results.push({ index: i, content: doc.content.slice(0, 50), status: 'success' });
        }
      } catch (err: any) {
        results.push({ index: i, content: doc.content.slice(0, 50), status: 'error', error: err.message });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const skippedCount = results.filter(r => r.status === 'skipped').length;

    return NextResponse.json({
      success: true,
      summary: { total: documents.length, success: successCount, error: errorCount, skipped: skippedCount },
      results,
    });

  } catch (error: any) {
    console.error('Bulk Ingest Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan.' }, { status: 500 });
  }
}
