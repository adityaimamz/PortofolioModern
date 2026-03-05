"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Bot, User, MessageCircle, Clock, Hash, ChevronRight, Activity } from "lucide-react";

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch list of unique sessions
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/chats');
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessionMessages = async (sessionId: string) => {
    setIsLoadingMessages(true);
    setSelectedSession(sessionId);
    try {
      const res = await fetch(`/api/admin/chats/${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setSessionMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Riwayat Percakapan AI</h2>
          <p className="text-white-100/60">Pantau interaksi pengunjung dengan AI Assistant Anda</p>
        </div>
        <button 
          onClick={fetchSessions}
          className="px-4 py-2 bg-white-100/5 hover:bg-white-100/10 text-white rounded-xl border border-white-100/10 transition-all flex items-center gap-2"
        >
          <Activity className="w-4 h-4 text-purple" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
        
        <div className="lg:col-span-1 bg-black-200 border border-white-100/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white-100/10 bg-black-100">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-cyan" />
              Sesi Pengunjung
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white-100/10">
            {isLoading ? (
              <div className="p-8 text-center text-white-100/50">Memuat sesi...</div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-white-100/50">Belum ada riwayat percakapan.</div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => fetchSessionMessages(session.session_id)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-4 ${
                      selectedSession === session.session_id 
                        ? 'bg-purple/10 border border-purple/30' 
                        : 'hover:bg-white-100/5 border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white-100/5 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white-100/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">
                        Sesi {session.session_id.split('-')[0]}...
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-white-100/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(session.latest_message), "dd MMM, HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-mono bg-white-100/10 text-white-100/70 py-1 px-2 rounded-lg">
                      {session.message_count}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-black-200 border border-white-100/10 rounded-2xl flex flex-col overflow-hidden">
          {selectedSession ? (
            <>
              <div className="p-4 border-b border-white-100/10 bg-black-100 flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple" />
                <h3 className="font-semibold text-white truncate text-sm">
                  {selectedSession}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white-100/10">
                {isLoadingMessages ? (
                  <div className="h-full flex items-center justify-center text-white-100/50">
                    Memuat pesan...
                  </div>
                ) : (
                  sessionMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-4 max-w-[85%] ${
                        msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-white-100/10' : 'bg-gradient-to-r from-purple to-cyan'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-white-100/70" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-purple/20 border border-purple/30 text-white rounded-tr-sm' 
                          : 'bg-white-100/5 border border-white-100/10 text-white-100 rounded-tl-sm'
                      }`}>
                        {msg.content}
                        <div className={`text-[10px] mt-2 opacity-40 flex items-center gap-1 ${
                          msg.role === 'user' ? 'justify-end' : ''
                        }`}>
                          <Clock className="w-3 h-3" />
                          {format(new Date(msg.created_at), "HH:mm:ss")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white-100/40 p-8">
              <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
              <p>Pilih sesi di sebelah kiri untuk melihat histori percakapan</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
