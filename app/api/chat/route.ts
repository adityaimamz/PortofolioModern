import { createClient } from "@supabase/supabase-js";
import { google } from "@ai-sdk/google";
import { embed, generateText } from "ai";
import { NextResponse } from "next/server";

// Memungkinkan response streaming
export const maxDuration = 60;

// Batas maksimal pesan per IP
const MAX_MESSAGES_PER_IP = 5;

export async function POST(req: Request) {
  try {
    const profileName =
      process.env.PUBLIC_PROFILE_NAME ||
      process.env.NEXT_PUBLIC_PROFILE_NAME ||
      "Portfolio Owner";

    const { messages, language } = await req.json();

    // Dapatkan sessionId dari query param atau fallback ke "anonymous"
    const { searchParams } = new URL(req.url);
    const sessionId =
      searchParams.get("sessionId") || "anonymous-" + Date.now();

    // Dapatkan pesan terakhir dari user
    const lastMessage = messages[messages.length - 1];

    // Vercel AI SDK v6: ekstrak teks dari parts atau content
    const userQuery =
      lastMessage.content ||
      (lastMessage.parts
        ? lastMessage.parts
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join(" ")
        : "");

    console.log("Menerima query:", userQuery);

    // Ekstrak IP client dari header
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") ||
        req.headers.get("cf-connecting-ip") ||
        "unknown";

    console.log("Client IP:", clientIp);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ============ CEK RATE LIMIT PER IP ============
    const { data: limitData } = await supabase
      .from("ip_rate_limits")
      .select("message_count")
      .eq("ip_address", clientIp)
      .single();

    const currentCount = limitData?.message_count ?? 0;
    const isNewIp = !limitData;

    if (currentCount >= MAX_MESSAGES_PER_IP) {
      console.warn(
        `Rate limit tercapai untuk IP: ${clientIp} (${currentCount}/${MAX_MESSAGES_PER_IP})`,
      );
      return NextResponse.json(
        { error: "rate_limit_exceeded", remaining: 0 },
        { status: 429 },
      );
    }
    // ===============================================

    const _ = await supabase.from("chat_logs").insert({
      session_id: sessionId,
      role: "user",
      content: userQuery,
    });

    // 1. Generate Embedding untuk query pengguna
    const { embedding } = await embed({
      model: google.textEmbeddingModel("gemini-embedding-001"),
      value: userQuery,
    });

    console.log("Embedding dimensi:", embedding.length);

    // 2. Similarity Search di Supabase (pgvector)
    let documents: any[] = [];

    // Coba RPC match_documents
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: embedding,
        match_count: 5,
        match_threshold: 0.3,
        filter: {},
      },
    );

    if (rpcError) {
      console.error("RPC Error:", rpcError.message);
    } else {
      documents = rpcData || [];
    }

    console.log(`RPC result: ${documents.length} dokumen ditemukan.`);

    if (documents.length === 0) {
      console.log("Fallback: mengambil semua dokumen langsung dari tabel...");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("documents")
        .select("id, content, metadata")
        .limit(10);

      if (fallbackError) {
        console.error("Fallback Query Error:", fallbackError);
      } else {
        documents = fallbackData || [];
        console.log(`Fallback: Ditemukan ${documents.length} dokumen.`);
      }
    }

    // 3. Ekstrak teks dari hasil pencarian DB
    let contextText = "";
    if (documents && documents.length > 0) {
      contextText = documents.map((doc: any) => doc.content).join("\n---\n");
      console.log(`Total konteks: ${documents.length} dokumen digunakan.`);
    } else {
      console.log("Tidak ada konteks tersedia di DB.");
    }

    // 4. Prompt engineering
    const isEnglish = language === "en";
    const defaultLanguageInstruction = isEnglish
      ? "Inggris (English)"
      : "Indonesia";

    const systemPrompt = `Kamu adalah asisten AI (Digital Twin) yang merepresentasikan "${profileName}", seorang Full-Stack Developer spesialis di ekosistem Next.js, React, TypeScript, dan Supabase.
Tugas kamu adalah menjawab pertanyaan dari pengunjung portofolio berdasarkan informasi (konteks) yang diberikan ke kamu.
Gunakan nada bahasa yang profesional, ramah, dan sedikit antusias.

PENTING - ATURAN BAHASA (LANGUAGE RULES):
1. **DETEKSI BAHASA**: Deteksi bahasa pengguna pada pesan terakhir mereka (Inggris atau Indonesia).
2. **TERJEMAHAN WAJIB**: Konteks profil di bawah ini ditulis menggunakan bahasa Indonesia. JIKA pengguna bertanya dalam bahasa INGGRIS (English), kamu **WAJIB** menerjemahkan jawabanmu sepenuhnya ke bahasa Inggris. **JANGAN SEKALI-KALI** membalas dalam bahasa Indonesia jika di-chat dalam bahasa Inggris.
3. **BALASAN SEIMBANG**: Berlaku sebaliknya, jika pengguna bertanya dalam bahasa Indonesia, balas dalam bahasa Indonesia. Jangan membalas dengan bahasa campuran.

ATURAN PERILAKU LAINNYA:
- JIKA kamu menemukan jawaban di dalam KONTEKS, jawablah mengacu pada data tersebut.
  - JIKA pertanyaan TIDAK berkaitan dengan ${profileName} (misalnya pertanyaan umum, politik, dll), jawab dengan sopan bahwa kamu hanya bisa menjawab hal-hal seputar ${profileName} seperti pengalaman kerja, tech stack, proyek, dan latar belakang pendidikannya. JANGAN menyebut kata "database" atau istilah teknis lainnya.
  - JIKA pertanyaan berkaitan dengan ${profileName} tapi konteks tidak tersedia, jawab bahwa informasi tersebut belum tersedia saat ini, lalu arahkan pengunjung untuk bertanya hal lain tentang ${profileName}.
- SELALU berikan response. Tidak boleh ada kondisi dimana kamu tidak menjawab sama sekali.
  - Jangan mengarang (berhalusinasi) informasi tentang ${profileName} yang tidak ada di konteks.
- Jawab dalam format markdown yang rapi (bold, list) jika diperlukan.
  - Berikan kesan bahwa kamu benar-benar "mengenal" ${profileName} secara personal.

  -- KONTEKS TENTANG ${profileName.toUpperCase()} --
${contextText || "(Tidak ada konteks spesifik tersedia saat ini)"}
----------------------------
`;

    // 5. Konversi format pesan UIMessage (parts) -> CoreMessage (content)
    const convertedMessages = messages.map((msg: any) => {
      if (msg.content) {
        return { role: msg.role, content: msg.content };
      }
      if (msg.parts) {
        const textContent = msg.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text)
          .join("");
        return { role: msg.role, content: textContent || "..." };
      }
      return { role: msg.role, content: "..." };
    });

    const modelCandidates = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
    ];

    for (const modelName of modelCandidates) {
      try {
        console.log(`Mencoba model: ${modelName}`);
        const result = await generateText({
          model: google(modelName),
          system: systemPrompt,
          messages: convertedMessages,
          maxRetries: 0,
        });

        console.log(`✅ Model ${modelName} berhasil.`);

        // 7. Bungkus hasil generateText ke format UIMessageStream
        const responseText = result.text;
        const msgId = `msg-${Date.now()}`;

        // [MODIFIKASI] Simpan balasan AI ke Chat Logs
        // Fire-and-forget (tidak di-await agar response ke user lebih cepat)
        supabase
          .from("chat_logs")
          .insert({
            session_id: sessionId,
            role: "assistant",
            content: responseText,
          })
          .then(({ error: logError }) => {
            if (logError) console.error("Gagal menyimpan log AI:", logError);
          });

        // ============ INCREMENT RATE LIMIT IP ============
        if (isNewIp) {
          supabase
            .from("ip_rate_limits")
            .insert({ ip_address: clientIp, message_count: 1 })
            .then(({ error: e }) => {
              if (e) console.error("Gagal insert ip_rate_limits:", e.message);
            });
        } else {
          supabase
            .from("ip_rate_limits")
            .update({
              message_count: currentCount + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("ip_address", clientIp)
            .then(({ error: e }) => {
              if (e) console.error("Gagal update ip_rate_limits:", e.message);
            });
        }
        // =================================================

        const remaining = MAX_MESSAGES_PER_IP - (currentCount + 1);

        return NextResponse.json(
          {
            id: msgId,
            text: responseText,
            remaining,
          },
          { status: 200 },
        );
      } catch (err: any) {
        console.warn(
          `❌ Model ${modelName} gagal: ${err.message?.slice(0, 120)}`,
        );
        continue;
      }
    }

    // Semua model gagal
    console.error("Semua model AI gagal.");
    return NextResponse.json(
      {
        error:
          "Semua model AI sedang tidak tersedia saat ini. Silakan coba lagi nanti.",
      },
      { status: 503 },
    );
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
