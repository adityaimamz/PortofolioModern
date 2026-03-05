import React from 'react';
import Link from 'next/link';
import { IconBrain, IconSettings, IconMessageChatbot } from '@tabler/icons-react';

export default function AdminIndexPage() {
  return (
    <div className="space-y-8 w-full max-w-5xl">
       <div>
        <h1 className="text-3xl font-bold mb-2">Selamat Datang di Workspace Admin 👋</h1>
        <p className="text-white-100/70 text-sm">
          Pusat kendali untuk mengelola isi portofolio pintar Anda dan fitur AI Digital Twin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
         <Link href="/admin/knowledge" className="group p-6 bg-black-200 border border-white-100/10 hover:border-purple/50 rounded-2xl shadow-xl transition-all hover:shadow-[0_0_20px_rgba(203,172,249,0.15)] flex flex-col gap-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-50 translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <IconBrain className="w-24 h-24 text-purple/20" />
             </div>
             <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center border border-purple/20">
                <IconBrain className="w-6 h-6 text-purple" />
             </div>
             <div>
                <h3 className="text-lg font-semibold text-white-100 mb-1">Knowledge Base</h3>
                <p className="text-sm text-white-100/60 leading-relaxed">Tambah dan latih memori AI Anda dengan data pengalaman, proyek, dan stack teknologi.</p>
             </div>
         </Link>

         <div className="group p-6 bg-black-200 border border-white-100/10 hover:border-cyan/50 rounded-2xl shadow-xl transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col gap-4 relative overflow-hidden opacity-70 cursor-not-allowed">
             <div className="absolute top-0 right-0 p-4 opacity-50 translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <IconSettings className="w-24 h-24 text-cyan/20" />
             </div>
             <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center border border-cyan/20">
                <IconSettings className="w-6 h-6 text-cyan" />
             </div>
             <div>
                <h3 className="text-lg font-semibold text-white-100 mb-1">Konfigurasi AI <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-white-100/10 text-white-100/70">Segera</span></h3>
                <p className="text-sm text-white-100/60 leading-relaxed">Atur temperature kreatifitas, behavior, sistem dan prompt dasar asisten Anda.</p>
             </div>
         </div>

         <div className="group p-6 bg-black-200 border border-white-100/10 hover:border-blue-500/50 rounded-2xl shadow-xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col gap-4 relative overflow-hidden opacity-70 cursor-not-allowed">
             <div className="absolute top-0 right-0 p-4 opacity-50 translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <IconMessageChatbot className="w-24 h-24 text-blue-500/20" />
             </div>
             <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <IconMessageChatbot className="w-6 h-6 text-blue-500" />
             </div>
             <div>
                <h3 className="text-lg font-semibold text-white-100 mb-1">Log Pesan <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-white-100/10 text-white-100/70">Segera</span></h3>
                <p className="text-sm text-white-100/60 leading-relaxed">Pantau history dan riwayat pengguna yang telah berinteraksi dengan AI Anda.</p>
             </div>
         </div>
      </div>
    </div>
  );
}
