import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const withCreatedAt = await supabase
      .from("documents")
      .select("id, content, metadata, created_at")
      .order("id", { ascending: false });

    if (!withCreatedAt.error) {
      return NextResponse.json(withCreatedAt.data || []);
    }

    const missingCreatedAt = withCreatedAt.error.message
      .toLowerCase()
      .includes("created_at");

    if (!missingCreatedAt) {
      console.error("Gagal mengambil daftar knowledge:", withCreatedAt.error);
      return NextResponse.json(
        { error: withCreatedAt.error.message },
        { status: 500 },
      );
    }

    const withoutCreatedAt = await supabase
      .from("documents")
      .select("id, content, metadata")
      .order("id", { ascending: false });

    if (withoutCreatedAt.error) {
      console.error(
        "Gagal mengambil daftar knowledge (fallback):",
        withoutCreatedAt.error,
      );
      return NextResponse.json(
        { error: withoutCreatedAt.error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(withoutCreatedAt.data || []);
  } catch (error: any) {
    console.error("API Admin Knowledge List Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
