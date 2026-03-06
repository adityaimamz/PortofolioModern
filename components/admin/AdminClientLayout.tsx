"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconSettings,
  IconBrain,
  IconDashboard,
  IconArrowLeft,
  IconUser,
  IconMessage2,
  IconLoader,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    // Memeriksa autentikasi dengan menembak API /api/admin/me
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setAuthError(data.error || "Gagal masuk. Silakan coba lagi.");
      }
    } catch (error) {
      setAuthError("Terjadi kesalahan sistem saat mencoba masuk.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
       await fetch("/api/admin/logout", { method: "POST" });
       setIsAuthenticated(false);
       // Refresh page untuk memastikan semua state bersih
       window.location.href = '/admin';
    } catch (error) {
       console.error("Gagal logout.", error);
    }
  };


  if (isAuthenticated === null) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black-100 p-4">
             <IconLoader className="w-8 h-8 text-purple animate-spin" />
             <p className="mt-4 text-white-100/60 text-sm animate-pulse">Memuat workspace...</p>
        </div>
      );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black-100 p-4">
        <div className="w-full max-w-md p-8 bg-black-200 border border-white-100/10 rounded-2xl shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple to-cyan/50 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(203,172,249,0.3)] border border-purple/30">
               <span className="text-2xl font-bold text-white">IZ</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-white">Admin Workspace</h1>
          <p className="text-white-100/60 text-center text-sm mb-8">Otorisasi dibutuhkan untuk mengakses sistem panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white-100/70 mb-2">
                Sandi Otorisasi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black-100 border border-white-100/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple/30 text-white placeholder:text-white-100/30 transition-all font-mono"
                placeholder="••••••••"
                autoFocus
                disabled={isLoggingIn}
              />
            </div>
            {authError && (
               <motion.p 
                 initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                 className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20"
               >
                 {authError}
               </motion.p>
            )}
            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full py-3 px-4 bg-purple hover:bg-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-purple/20 mt-4 outline-none focus:ring-2 focus:ring-white/20 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <IconLoader className="w-5 h-5 animate-spin" /> Sedang Memverifikasi...
                </>
              ) : "Autentikasi Akses"}
            </button>
          </form>
          
           <div className="mt-8 text-center">
            <Link href="/" className="text-sm border-b border-transparent hover:border-white-100/40 text-white-100/60 hover:text-white-100/90 transition-all flex items-center justify-center gap-2 mx-auto w-fit">
               <IconArrowLeft className="w-4 h-4" /> Kembali Ke Portofolio Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconDashboard className="text-white-100 h-5 w-5 flex-shrink-0 group-hover/sidebar:text-purple transition-colors" />
      ),
    },
    {
      label: "AI Knowledge Base",
      href: "/admin/knowledge",
      icon: (
        <IconBrain className="text-white-100 h-5 w-5 flex-shrink-0 group-hover/sidebar:text-purple transition-colors" />
      ),
    },
    {
      label: "Riwayat Chat AI",
      href: "/admin/chats",
      icon: (
        <IconMessage2 className="text-white-100 h-5 w-5 flex-shrink-0 group-hover/sidebar:text-cyan transition-colors" />
      ),
    },
    {
      label: "Pengaturan Utama",
      href: "#", // Dummy for now
      icon: (
        <IconSettings className="text-white-100 h-5 w-5 flex-shrink-0 group-hover/sidebar:text-purple transition-colors" />
      ),
    },
    {
      label: "Kembali ke Web",
      href: "/",
      icon: (
        <IconArrowLeft className="text-white-100 h-5 w-5 flex-shrink-0 group-hover/sidebar:text-blue-400 transition-colors" />
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-black-100 w-full flex-1 mx-auto overflow-hidden h-screen text-white">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-black-200 border-r border-white-100/10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-4 flex flex-col items-start px-2 font-bold text-sm tracking-tight">
               <span className={`bg-clip-text text-transparent bg-gradient-to-r from-purple to-cyan transition-all duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'}`}>IZAdmin Workspace</span>
               {open === false && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple to-cyan/50 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(203,172,249,0.3)] border border-purple/30 ml-[-2px]">
                    <span className="text-[10px] font-bold text-white">IZ</span>
                  </div>
               )}
            </div>
            
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="hover:bg-white-100/5 rounded-lg transition-colors p-2 -ml-2" />
              ))}
              <button 
                onClick={handleLogout}
                className="flex items-center justify-start gap-2 group/sidebar py-2 hover:bg-white-100/5 rounded-lg transition-colors p-2 -ml-2 w-full text-left"
              >
                  <IconArrowLeft className="text-white-100 h-5 w-5 flex-shrink-0 group-hover/sidebar:text-red-400 transition-colors" />
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                  >
                    Logout Akses
                  </motion.span>
              </button>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Aditya Imam Z.",
                href: "#",
                icon: (
                   <div className="h-7 w-7 rounded-full flex-shrink-0 bg-white-100/10 flex items-center justify-center">
                     <IconUser className="w-4 h-4 text-purple" />
                   </div>
                ),
              }}
              className="pointer-events-none"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-y-auto bg-black-100 selection:bg-purple/30 selection:text-white-100">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full pt-20 md:pt-8 bg-black-100 min-h-screen">
              
            {/* Mobile Sidebar Toggle Area */}
             <div className="md:hidden absolute top-4 left-4 z-40 bg-black-200/80 backdrop-blur-md rounded-xl border border-white-100/10 shadow-lg p-1">
                {/*  Sidebar Mobile Toggle dipasang oleh Aceternity UI pada MobileSidebar */}
             </div>

             {children}
          </div>
      </main>
    </div>
  );
}
