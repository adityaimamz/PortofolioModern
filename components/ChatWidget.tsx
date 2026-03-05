"use client";

import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import { useChat } from '@ai-sdk/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const { messages, sendMessage, status } = useChat({
    messages: [
      {
        id: 'welcome',
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: 'Halo! Saya asisten AI milik Aditya Imam Zuhdi. Anda bisa menanyakan pengalaman kerja, Tech Stack, atau proyek yang pernah saya kerjakan. Apa yang ingin Anda ketahui?' }],
      }
    ],
    onError: (error: any) => {
      console.error('Chat Error:', error);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-purple to-blue-500 shadow-xl shadow-purple/30 text-white hover:shadow-purple/50 transition-all z-50 flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-black-100 border border-white-100/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black-200 border-b border-white-100/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple to-cyan flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Aditya's AI Twin</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white-100/50 hover:text-white-100 bg-white-100/5 hover:bg-white-100/10 rounded-lg transition-colors"
                aria-label="Tutup Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full bg-black/40 scrollbar-thin scrollbar-thumb-white-100/10 scrollbar-track-transparent"
            >
              {messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white-100/10 flex items-center justify-center mt-1">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white-100/70" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        message.role === 'user'
                          ? 'bg-purple text-white rounded-tr-sm'
                          : 'bg-black-200 text-white-100 border border-white-100/10 rounded-tl-sm prose prose-invert prose-sm'
                      }`}
                      style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                    >
                     
                      {message.parts?.map((part: any, index: number) => {
                        if (part.type === 'text') {
                          return (
                            <span 
                              key={index}
                              dangerouslySetInnerHTML={{ 
                                __html: part.text.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] flex-row">
                    <div className="w-8 h-8 rounded-full bg-white-100/10 flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 text-purple" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-black-200 text-white-100 border border-white-100/10 rounded-tl-sm flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white-100/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-white-100/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-white-100/40 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-black-200 border-t border-white-100/10 flex items-center gap-2"
            >
              <input
                className="flex-1 bg-black-100 border border-white-100/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/50 placeholder:text-white-100/40"
                value={input}
                onChange={handleInputChange}
                placeholder="Tanya sesuatu tentang saya..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-purple hover:bg-purple/80 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
