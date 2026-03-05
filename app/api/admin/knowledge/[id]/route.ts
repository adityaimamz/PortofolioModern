import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const parsedId = Number.parseInt(resolvedParams.id, 10);

    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      return NextResponse.json(
        { error: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error, count } = await supabase
      .from("documents")
      .delete({ count: "exact" })
      .eq("id", parsedId);

    if (error) {
      console.error("Gagal menghapus dokumen knowledge:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!count) {
      return NextResponse.json(
        { error: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, id: parsedId });
  } catch (error: any) {
    console.error("API Admin Knowledge Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
