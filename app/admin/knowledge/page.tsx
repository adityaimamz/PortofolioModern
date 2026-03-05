"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  IconDatabase,
  IconUpload,
  IconFileText,
  IconList,
  IconTrash,
  IconRefresh,
  IconDownload,
} from "@tabler/icons-react";

type KnowledgeDocument = {
  id: number;
  content: string;
  metadata?: { kategori?: string } | null;
  created_at?: string;
};

export default function KnowledgeBasePage() {
  // === Single Input State ===
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("umum");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // === Bulk Import State ===
  const [bulkJson, setBulkJson] = useState("");
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkStatus, setBulkStatus] = useState({ type: "", text: "" });
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // === Tab State ===
  const [activeTab, setActiveTab] = useState<"single" | "bulk" | "list">(
    "single",
  );

  // === List Documents State ===
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [listStatus, setListStatus] = useState({ type: "", text: "" });

  const loadDocuments = useCallback(async () => {
    setIsListLoading(true);
    setListStatus({ type: "", text: "" });

    try {
      const response = await fetch("/api/admin/knowledge", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setListStatus({
          type: "error",
          text: data.error || "Gagal memuat daftar knowledge.",
        });
        return;
      }

      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setListStatus({ type: "error", text: "Gagal menghubungi server." });
    } finally {
      setIsListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "list") {
      void loadDocuments();
    }
  }, [activeTab, loadDocuments]);

  const handleDeleteDocument = async (id: number) => {
    const shouldDelete = window.confirm(
      "Yakin ingin menghapus dokumen knowledge ini?",
    );
    if (!shouldDelete) return;

    setIsDeletingId(id);
    setListStatus({ type: "", text: "" });

    try {
      const response = await fetch(`/api/admin/knowledge/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setListStatus({
          type: "error",
          text: data.error || "Gagal menghapus dokumen.",
        });
        return;
      }

      setListStatus({
        type: "success",
        text: `Dokumen #${id} berhasil dihapus.`,
      });
      await loadDocuments();
    } catch (error) {
      console.error(error);
      setListStatus({ type: "error", text: "Gagal menghubungi server." });
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleExportJson = () => {
    if (documents.length === 0) {
      setListStatus({ type: "error", text: "Tidak ada dokumen untuk diekspor." });
      return;
    }

    const exportData = documents.map((doc) => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata || {},
      created_at: doc.created_at || null,
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `knowledge-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setListStatus({
      type: "success",
      text: `Berhasil mengekspor ${documents.length} dokumen.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setStatusMessage({
      type: "loading",
      text: "Sedang memproses dan menyimpan ke Supabase (via Google AI)...",
    });

    try {
      const response = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, metadata: { kategori: category } }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage({
          type: "success",
          text: "Data berhasil disuntikkan ke AI Knowledge Base!",
        });
        setContent("");
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: "error", text: "Gagal menghubungi server." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return;

    let parsed: any[];
    try {
      const raw = JSON.parse(bulkJson);
      parsed = Array.isArray(raw) ? raw : [raw];
    } catch {
      setBulkStatus({
        type: "error",
        text: "Format JSON tidak valid. Pastikan format sesuai contoh.",
      });
      return;
    }

    // Validasi setiap item
    const documents = parsed
      .map((item) => ({
        content: item.content || "",
        metadata:
          item.metadata || (item.kategori ? { kategori: item.kategori } : {}),
      }))
      .filter((d) => d.content.trim());

    if (documents.length === 0) {
      setBulkStatus({
        type: "error",
        text: "Tidak ada dokumen valid ditemukan dalam JSON.",
      });
      return;
    }

    setIsBulkLoading(true);
    setBulkProgress({ current: 0, total: documents.length });
    setBulkStatus({
      type: "loading",
      text: `Memproses ${documents.length} dokumen...`,
    });

    try {
      const response = await fetch("/api/admin/ingest-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents }),
      });

      const data = await response.json();

      if (response.ok) {
        const { summary } = data;
        setBulkStatus({
          type: summary.error > 0 ? "warning" : "success",
          text: `Selesai! ✅ ${summary.success} berhasil, ❌ ${summary.error} gagal, ⏭️ ${summary.skipped} dilewati (dari ${summary.total} total)`,
        });
        if (summary.error === 0) {
          setBulkJson("");
        }
      } else {
        setBulkStatus({
          type: "error",
          text: data.error || "Terjadi kesalahan.",
        });
      }
    } catch (error) {
      console.error(error);
      setBulkStatus({ type: "error", text: "Gagal menghubungi server." });
    } finally {
      setIsBulkLoading(false);
      setBulkProgress({ current: 0, total: 0 });
    }
  };

  const sampleJson = `[
  {
    "content": "Aditya adalah Full-Stack Web Developer...",
    "metadata": { "kategori": "profil" }
  },
  {
    "content": "Aditya bekerja di Telkomsigma...",
    "metadata": { "kategori": "pengalaman" }
  }
]`;

  return (
    <div className="space-y-8 w-full max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <IconDatabase className="w-8 h-8 text-purple text-opacity-80" />
          Knowledge Base AI
        </h1>
        <p className="text-white-100/70 text-sm">
          Tambahkan informasi baru mengenai diri Anda, project, atau tech stack
          agar AI Digital Twin dapat mempelajarinya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-black-200 border border-white-100/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Background glowing effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("single")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "single"
                    ? "bg-purple/20 text-purple border border-purple/30"
                    : "bg-white-100/5 text-white-100/50 border border-white-100/10 hover:bg-white-100/10"
                }`}
              >
                <IconFileText className="w-4 h-4" />
                Input Satu
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "bulk"
                    ? "bg-purple/20 text-purple border border-purple/30"
                    : "bg-white-100/5 text-white-100/50 border border-white-100/10 hover:bg-white-100/10"
                }`}
              >
                <IconUpload className="w-4 h-4" />
                Bulk Import JSON
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "list"
                    ? "bg-purple/20 text-purple border border-purple/30"
                    : "bg-white-100/5 text-white-100/50 border border-white-100/10 hover:bg-white-100/10"
                }`}
              >
                <IconList className="w-4 h-4" />
                Daftar Knowledge
              </button>
            </div>

            {/* === Single Input Tab === */}
            {activeTab === "single" && (
              <>
                <h2 className="text-xl font-semibold mb-6">Input Data Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white-100/70 mb-2">
                      Kategori Data
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-black-100 border border-white-100/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 text-white appearance-none cursor-pointer"
                    >
                      <option value="profil">Profil &amp; Bio</option>
                      <option value="pengalaman">Pengalaman Kerja</option>
                      <option value="proyek">Proyek &amp; Portofolio</option>
                      <option value="tech_stack">Tech Stack &amp; Skill</option>
                      <option value="pendidikan">
                        Pendidikan dan Sertifikasi
                      </option>
                      <option value="lainnya">Lainnya / Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white-100/70 mb-2">
                      Konten (Context)
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 bg-black-100 border border-white-100/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 resize-y placeholder:text-white-100/30 text-sm leading-relaxed"
                      placeholder="Ketik informasi lengkap di sini. Misalnya: 'Pada bulan Januari 2026, saya meluncurkan fitur AI Digital Twin menggunakan Next.js dan Supabase...'"
                      required
                    />
                  </div>

                  <div className="pt-4 border-t border-white-100/10">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-purple to-blue-500 hover:from-purple hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(203,172,249,0.2)] hover:shadow-[0_0_30px_rgba(203,172,249,0.4)]"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-3">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Menyimpan &amp; Membuat Vector...
                        </span>
                      ) : (
                        "Upload ke AI Knowledge Base"
                      )}
                    </button>
                  </div>

                  {statusMessage.text && (
                    <div
                      className={`p-4 mt-4 rounded-xl text-sm ${
                        statusMessage.type === "success"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : statusMessage.type === "error"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      <p className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${statusMessage.type === "success" ? "bg-green-400" : "bg-red-400"}`}
                        ></span>
                        {statusMessage.text}
                      </p>
                    </div>
                  )}
                </form>
              </>
            )}

            {/* === Bulk Import Tab === */}
            {activeTab === "bulk" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Bulk Import JSON</h2>
                <p className="text-sm text-white-100/50 mb-4">
                  Paste JSON array berisi semua dokumen knowledge sekaligus.
                  Setiap item akan di-embed dan disimpan otomatis.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white-100/70 mb-2">
                      JSON Data
                    </label>
                    <textarea
                      value={bulkJson}
                      onChange={(e) => setBulkJson(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 bg-black-100 border border-white-100/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 resize-y placeholder:text-white-100/30 text-xs font-mono leading-relaxed"
                      placeholder={sampleJson}
                    />
                  </div>

                  {/* Format Guide */}
                  <div className="bg-black-100/50 border border-white-100/10 rounded-xl p-4">
                    <p className="text-xs font-medium text-white-100/60 mb-2">
                      📋 Format yang didukung:
                    </p>
                    <pre className="text-xs text-cyan/80 font-mono overflow-x-auto whitespace-pre-wrap">
                      {sampleJson}
                    </pre>
                  </div>

                  <div className="pt-4 border-t border-white-100/10">
                    <button
                      onClick={handleBulkImport}
                      disabled={isBulkLoading || !bulkJson.trim()}
                      className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-cyan to-purple hover:from-cyan hover:to-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                    >
                      {isBulkLoading ? (
                        <span className="flex items-center gap-3">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {bulkProgress.total > 0
                            ? `Memproses ${bulkProgress.total} dokumen...`
                            : "Memproses..."}
                        </span>
                      ) : (
                        <>
                          <IconUpload className="w-5 h-5 mr-2" />
                          Import Semua Dokumen
                        </>
                      )}
                    </button>
                  </div>

                  {bulkStatus.text && (
                    <div
                      className={`p-4 rounded-xl text-sm ${
                        bulkStatus.type === "success"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : bulkStatus.type === "warning"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : bulkStatus.type === "error"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      <p className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            bulkStatus.type === "success"
                              ? "bg-green-400"
                              : bulkStatus.type === "warning"
                                ? "bg-yellow-400 animate-pulse"
                                : bulkStatus.type === "loading"
                                  ? "bg-blue-400 animate-pulse"
                                  : "bg-red-400"
                          }`}
                        ></span>
                        {bulkStatus.text}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* === List Documents Tab === */}
            {activeTab === "list" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Daftar Knowledge</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportJson}
                      disabled={isListLoading || documents.length === 0}
                      className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconDownload className="w-4 h-4" />
                      Export JSON
                    </button>
                    <button
                      onClick={() => void loadDocuments()}
                      disabled={isListLoading}
                      className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-white-100/15 bg-white-100/5 hover:bg-white-100/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconRefresh
                        className={`w-4 h-4 ${isListLoading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </button>
                  </div>
                </div>

                {isListLoading && (
                  <div className="space-y-3">
                    <div className="h-20 rounded-xl bg-white-100/5 border border-white-100/10 animate-pulse" />
                    <div className="h-20 rounded-xl bg-white-100/5 border border-white-100/10 animate-pulse" />
                    <div className="h-20 rounded-xl bg-white-100/5 border border-white-100/10 animate-pulse" />
                  </div>
                )}

                {!isListLoading &&
                  documents.length === 0 &&
                  !listStatus.text && (
                    <div className="p-5 rounded-xl border border-white-100/10 bg-white-100/5 text-sm text-white-100/60">
                      Belum ada dokumen knowledge tersimpan.
                    </div>
                  )}

                {!isListLoading && documents.length > 0 && (
                  <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-white-100/15 bg-black-100/70 p-4 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-2 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-white-100/60">
                            <span className="px-2 py-1 rounded-md bg-white-100/10 border border-white-100/10 text-white-100/80">
                              ID #{doc.id}
                            </span>
                            <span className="px-2 py-1 rounded-md bg-cyan/10 border border-cyan/30 text-cyan">
                              {doc.metadata?.kategori || "tanpa kategori"}
                            </span>
                            <span>
                              {doc.created_at
                                ? new Date(doc.created_at).toLocaleString(
                                    "id-ID",
                                  )
                                : "Waktu tidak tersedia"}
                            </span>
                          </div>
                          <p className="text-sm text-white-100/80 leading-relaxed break-words">
                            {doc.content?.length > 500
                              ? `${doc.content.slice(0, 500)}...`
                              : doc.content}
                          </p>
                        </div>

                        <button
                          onClick={() => void handleDeleteDocument(doc.id)}
                          disabled={isDeletingId === doc.id}
                          className="shrink-0 inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <IconTrash className="w-4 h-4" />
                          {isDeletingId === doc.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {listStatus.text && (
                  <div
                    className={`p-4 mt-4 rounded-xl text-sm ${
                      listStatus.type === "success"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {listStatus.text}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black-200 border border-white-100/10 rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan animate-pulse"></span>
              Bagaimana ini bekerja?
            </h3>
            <p className="text-sm text-white-100/60 leading-relaxed mb-4">
              Setiap teks yang Anda masukkan akan dikirim ke API{" "}
              <strong className="text-white-100/90">Google AI</strong> untuk
              diubah menjadi kumpulan angka matematis berdimensi tinggi (
              <i>Vector Embedding</i>).
            </p>
            <p className="text-sm text-white-100/60 leading-relaxed">
              Vektor tersebut kemudian disimpan di database{" "}
              <strong className="text-white-100/90">Supabase (pgvector)</strong>
              . Ketika user bertanya di chatbot, AI akan mencari teks di
              database Anda yang secara makna paling mirip dengan pertanyaan
              tersebut!
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-yellow-500 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> Tips Penulisan Konteks
            </h3>
            <ul className="text-xs text-yellow-500/80 space-y-2.5 list-disc list-inside">
              <li>Tulis informasi yang spesifik dan jelas.</li>
              <li>
                Sertakan tanggal kejadian atau periode waktu jika relevan.
              </li>
              <li>Sebutkan nama teknologi yang dipakai secara eksplisit.</li>
              <li>Untuk bulk import, gunakan format JSON array.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
