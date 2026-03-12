"use client";

import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid"; // Gunakan uuid untuk sessionId unik

import { useLanguage } from "@/context/LanguageContext";

const suggestedQuestionsId = [
  "Siapa Aditya Imam Zuhdi?",
  "Apa tech stack yang dikuasai?",
  "Proyek apa saja yang pernah dibuat?",
  "Apakah Aditya menerima freelance?",
  "Apakah bisa kolaborasi full-stack?",
  "Bagaimana cara menghubungi Aditya?",
];

const suggestedQuestionsEn = [
  "Who is Aditya Imam Zuhdi?",
  "What is his tech stack?",
  "What projects has he built?",
  "Does Aditya take freelance work?",
  "Is he available for full-stack collaboration?",
  "How can I contact Aditya?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null,
  );
  const { language } = useLanguage();
  const profileName = process.env.NEXT_PUBLIC_PROFILE_NAME || "Portfolio Owner";
  const aiTwinName =
    process.env.NEXT_PUBLIC_AI_TWIN_NAME || `${profileName}'s AI Twin`;

  const welcomeMessageId = `Halo! Saya asisten AI milik ${profileName}. Anda bisa menanyakan pengalaman kerja, tech stack, atau proyek yang pernah saya kerjakan. Apa yang ingin Anda ketahui?`;
  const welcomeMessageEn = `Hello! I am ${profileName}'s AI assistant. You can ask me about his work experience, tech stack, or projects. What would you like to know?`;
  const welcomeMessage =
    language === "id" ? welcomeMessageId : welcomeMessageEn;
  const suggestedQuestions =
    language === "id" ? suggestedQuestionsId : suggestedQuestionsEn;

  // Generate UUID unik hanya sekali saat komponen dimount (per sesi browser/refresh)
  const sessionId = useRef(uuidv4());

  type ChatMessage = {
    id: string;
    role: "user" | "assistant" | "system";
    parts: { type: "text"; text: string }[];
  };

  const { messages, setMessages } = useChat({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{ type: "text", text: welcomeMessage }],
      },
    ] as ChatMessage[],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Update welcome message dynamically if the user switches language
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0 && prev[0].id === "welcome") {
        const currentWelcomeText = prev[0].parts?.[0]?.text;
        if (currentWelcomeText && currentWelcomeText !== welcomeMessage) {
          const newMessages = [...prev];
          newMessages[0] = {
            ...newMessages[0],
            parts: [{ type: "text", text: welcomeMessage }],
          };
          return newMessages as ChatMessage[];
        }
      }
      return prev;
    });
  }, [language, welcomeMessage, setMessages]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading || isRateLimited) return;

    setIsLoading(true);

    // Tambahkan pesan user ke UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        parts: [{ type: "text", text: userMessage }],
      },
    ]);

    try {
      const maxHistoryLength = 5;
      const recentMessages = messages.slice(-maxHistoryLength);

      const response = await fetch(`/api/chat?sessionId=${sessionId.current}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          messages: [...recentMessages, { role: "user", content: userMessage }],
        }),
      });

      // Handle rate limit exceeded (429)
      if (response.status === 429) {
        setIsRateLimited(true);
        setRemainingMessages(0);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            parts: [
              {
                type: "text",
                text:
                  language === "id"
                    ? "⚠️ Kamu telah mencapai batas maksimal **5 pesan** untuk IP ini. Terima kasih sudah menggunakan chat!"
                    : "⚠️ You have reached the maximum limit of **5 messages** for your IP address. Thank you for using the chat!",
              },
            ],
          },
        ]);
        return;
      }

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const aiResponseText = data.text;

      // Update sisa pesan dari response server
      if (typeof data.remaining === "number") {
        setRemainingMessages(data.remaining);
        if (data.remaining === 0) {
          setIsRateLimited(true);
        }
      }

      const assistantMessageId = data.id || (Date.now() + 1).toString();

      const words = aiResponseText.split(" ");
      let currentText = "";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          parts: [{ type: "text", text: "" }],
        },
      ]);

      for (let i = 0; i < words.length; i++) {
        currentText += words[i] + " ";
        // Update pesan yang sama
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, parts: [{ type: "text", text: currentText }] }
              : msg,
          ),
        );
        // delay per kata 20ms
        await new Promise((r) => setTimeout(r, 20));
      }
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  const handleSuggestedClick = async (question: string) => {
    await sendMessage(question);
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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-black-100 border border-white-100/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black-200 border-b border-white-100/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple to-cyan flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {aiTwinName}
                  </h3>
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
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white-100/10 flex items-center justify-center mt-1">
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white-100/70" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm ${
                        message.role === "user"
                          ? "bg-purple text-white rounded-tr-sm"
                          : "bg-black-200 text-white-100 border border-white-100/10 rounded-tl-sm prose prose-invert prose-sm"
                      }`}
                      style={{
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.parts?.map((part: any, index: number) => {
                        if (part.type === "text") {
                          return (
                            <ReactMarkdown key={index}>
                              {part.text}
                            </ReactMarkdown>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Suggested Questions */}
              {messages.length === 1 && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                  {suggestedQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedClick(sq)}
                      className="px-3 py-1.5 text-xs bg-purple/10 hover:bg-purple/20 text-white-100 border border-purple/30 hover:border-purple/50 rounded-full transition-all text-left"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              )}

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
            <div className="bg-black-200 border-t border-white-100/10">
              {/* Remaining messages counter */}
              {remainingMessages !== null && !isRateLimited && (
                <div className="px-3 pt-2 flex justify-end">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      remainingMessages <= 1
                        ? "text-red-400 border-red-400/30 bg-red-400/10"
                        : remainingMessages <= 2
                          ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                          : "text-white-100/40 border-white-100/10 bg-white-100/5"
                    }`}
                  >
                    {language === "id"
                      ? `${remainingMessages} pesan tersisa`
                      : `${remainingMessages} messages left`}
                  </span>
                </div>
              )}

              {isRateLimited ? (
                /* Blocked UI saat rate limit tercapai */
                <div className="p-4 flex flex-col items-center gap-2 text-center">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                    <span className="text-sm">🚫</span>
                  </div>
                  <p className="text-xs font-semibold text-red-400">
                    {language === "id"
                      ? "Batas chat tercapai (5/5)"
                      : "Chat limit reached (5/5)"}
                  </p>
                  <p className="text-xs text-white-100/40 leading-relaxed">
                    {language === "id"
                      ? "Kamu telah menggunakan semua 5 pesan untuk IP ini."
                      : "You have used all 5 messages for your IP address."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-3 flex items-center gap-2"
                >
                  <input
                    className="flex-1 bg-black-100 border border-white-100/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/50 placeholder:text-white-100/40"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                      language === "id"
                        ? "Tanya sesuatu tentang saya..."
                        : "Ask something about me..."
                    }
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
