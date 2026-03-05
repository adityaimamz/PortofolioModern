import { createClient } from '@supabase/supabase-js';
import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { NextResponse } from 'next/server';

// Memungkinkan response streaming
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Dapatkan pesan terakhir dari user
    const lastMessage = messages[messages.length - 1];
    
    // Vercel AI SDK v6: ekstrak teks dari parts atau content
    const userQuery = lastMessage.content 
      || (lastMessage.parts 
          ? lastMessage.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(' ') 
          : '');

    console.log("Menerima query:", userQuery);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing.");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Generate Embedding untuk query pengguna
    const { embedding } = await embed({
      model: google.textEmbeddingModel('gemini-embedding-001'),
      value: userQuery,
    });

    console.log("Embedding dimensi:", embedding.length);

    // 2. Similarity Search di Supabase (pgvector)
    let documents: any[] = [];
    
    // Coba RPC match_documents
    const { data: rpcData, error: rpcError } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: 5,
      match_threshold: 0.3,
      filter: {}
    });

    if (rpcError) {
      console.error("RPC Error:", rpcError.message);
    } else {
      documents = rpcData || [];
    }

    console.log(`RPC result: ${documents.length} dokumen ditemukan.`);

    // Fallback: jika RPC gagal ATAU mengembalikan 0 hasil, ambil semua data langsung
    if (documents.length === 0) {
      console.log("Fallback: mengambil semua dokumen langsung dari tabel...");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('documents')
        .select('id, content, metadata')
        .limit(10);
      
      if (fallbackError) {
        console.error("Fallback Query Error:", fallbackError);
      } else {
        documents = fallbackData || [];
        console.log(`Fallback: Ditemukan ${documents.length} dokumen.`);
      }
    }

    // 3. Ekstrak teks dari hasil pencarian DB
    let contextText = '';
    if (documents && documents.length > 0) {
      contextText = documents.map((doc: any) => doc.content).join('\n---\n');
      console.log(`Total konteks: ${documents.length} dokumen digunakan.`);
    } else {
      console.log('Tidak ada konteks tersedia di DB.');
    }

    // 4. Prompt engineering
    const systemPrompt = `Kamu adalah asisten AI (Digital Twin) yang merepresentasikan "Aditya Imam Zuhdi", seorang Full-Stack Developer spesialis di ekosistem Next.js, React, TypeScript, dan Supabase.
Tugas kamu adalah menjawab pertanyaan dari pengunjung portofolio berdasarkan informasi (konteks) yang diberikan ke kamu. 
Gunakan nada bahasa yang profesional, ramah, dan sedikit antusias. 
Jawab menggunakan bahasa Indonesia.

PENTING:
- JIKA kamu menemukan jawaban di dalam KONTEKS, jawablah mengacu pada data tersebut.
- JIKA pertanyaan TIDAK berkaitan dengan Aditya (misalnya pertanyaan umum, politik, dll), jawab dengan sopan bahwa kamu hanya bisa menjawab hal-hal seputar Aditya Imam Zuhdi seperti pengalaman kerja, tech stack, proyek, dan latar belakang pendidikannya. JANGAN menyebut kata "database" atau istilah teknis lainnya.
- JIKA pertanyaan berkaitan dengan Aditya tapi konteks tidak tersedia, jawab bahwa informasi tersebut belum tersedia saat ini, lalu arahkan pengunjung untuk bertanya hal lain tentang Aditya.
- SELALU berikan response. Tidak boleh ada kondisi dimana kamu tidak menjawab sama sekali.
- Jangan mengarang (berhalusinasi) informasi tentang Aditya yang tidak ada di konteks.
- Jawab dalam format markdown yang rapi (bold, list) jika diperlukan.
- Berikan kesan bahwa kamu benar-benar "mengenal" Aditya secara personal.

-- KONTEKS TENTANG ADITYA --
${contextText || '(Tidak ada konteks spesifik tersedia saat ini)'}
----------------------------
`;

    // 5. Konversi format pesan UIMessage (parts) -> CoreMessage (content)
    const convertedMessages = messages.map((msg: any) => {
      if (msg.content) {
        return { role: msg.role, content: msg.content };
      }
      if (msg.parts) {
        const textContent = msg.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
        return { role: msg.role, content: textContent || '...' };
      }
      return { role: msg.role, content: '...' };
    });

    // 6. Panggil Gemini via Vercel AI SDK
    const result = streamText({
      model: google('gemini-3.1-flash-lite'),
      system: systemPrompt,
      messages: convertedMessages,
    });

    // 7. Kembalikan UI message stream ke client (kompatibel dengan useChat hook)
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
