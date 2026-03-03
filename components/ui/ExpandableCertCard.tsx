"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

export function ExpandableCertCard({ cert, index }: { cert: any; index: number }) {
  const [active, setActive] = useState<boolean | null>(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useOutsideClick(ref, () => setActive(false));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm h-full w-full z-50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 md:p-10">
            <motion.div
              layoutId={`card-${cert.name}-${id}`}
              ref={ref}
              className="w-full max-w-2xl flex flex-col bg-neutral-900 border border-white/20 sm:rounded-3xl rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="relative relative flex items-center justify-center p-4">
                <div className="w-full relative overflow-hidden bg-neutral-800 rounded-t-xl sm:rounded-tl-3xl sm:rounded-tr-3xl">
                  {/* Default fallback image / Background */}
                  <img
                    src="/bg.png"
                    alt="bgimg"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
                  />
                  {/* Target image of the cert based on data */}
                  <img
                    src={cert.img || "/bg.png"}
                    onError={(e) => {
                      // Fallback logic if image not found
                      const target = e.target as HTMLImageElement;
                      target.src = '/bg.png'; // Fallback bg if file doesnt exist
                      target.className = "absolute inset-0 w-full h-full object-cover opacity-30 z-10";
                    }}
                    alt={cert.name}
                    className="relative z-10 object-contain max-h-[40vh] md:max-h-[50vh] w-full"
                  />
                </div>
                
                <div className="absolute top-8 right-8 z-[101]">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.05 } }}
                    className="flex w-10 h-10 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md hover:bg-black/80 transition-colors"
                    onClick={() => setActive(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="p-6 flex flex-col bg-neutral-950 relative">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 z-10 shadow-xl hidden">
                  <span className="text-2xl text-purple">📜</span>
                </div>
                
                <div className="flex justify-between items-start mb-2 gap-4">
                  <motion.h1
                    layoutId={`title-${cert.name}-${id}`}
                    className="font-bold text-xl md:text-2xl text-white"
                  >
                    {cert.name}
                  </motion.h1>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-base text-neutral-300 md:text-lg w-full leading-relaxed">
                      Provider: <span className="font-semibold text-purple">{cert.issuer}</span>
                    </p>
                    <p className="text-sm text-neutral-400 mt-2 flex items-center gap-2">
                       <span>📅</span> {cert.year}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${cert.name}-${id}`}
        onClick={() => setActive(true)}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-white/[0.1] overflow-hidden group hover:border-purple/30 transition-colors duration-300 cursor-pointer"
        style={{
          background: "rgb(15,15,15)",
          backgroundColor:
            "linear-gradient(90deg, rgba(15,15,15,1) 0%, rgba(30,30,30,1) 100%)",
        }}
      >
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-purple via-blue-500 to-emerald-500" />
        </div>

        <div className="relative z-10 p-5 flex items-center gap-4">
          <motion.div 
            layoutId={`icon-container-${cert.name}-${id}`}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center"
          >
            <span className="text-purple text-lg">✓</span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h3 
              layoutId={`title-${cert.name}-${id}`}
              className="text-sm md:text-base font-bold text-white line-clamp-2 leading-snug"
            >
              {cert.name}
            </motion.h3>
            <p className="text-white-200 text-xs mt-1">
              {cert.issuer} • {cert.year}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
