import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;

    // Validasi input
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs harus berupa array dan tidak boleh kosong." },
        { status: 400 },
      );
    }

    // Validasi setiap ID
    const validIds = ids
      .map((id) => Number.parseInt(String(id), 10))
      .filter((id) => Number.isFinite(id) && id > 0);

    if (validIds.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada ID yang valid ditemukan." },
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
      .in("id", validIds);

    if (error) {
      console.error("Gagal menghapus dokumen knowledge (bulk):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      deletedCount: count || 0,
      requestedCount: validIds.length,
    });
  } catch (error: any) {
    console.error("API Admin Knowledge Bulk Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
