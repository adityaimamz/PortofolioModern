"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { FaLocationArrow } from "react-icons/fa6";
import { PinContainer } from "./Pin";

export function ExpandableProjectCard({ item }: { item: any }) {
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
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 md:p-8">
            <motion.div
              layoutId={`card-${item.id}-${id}`}
              ref={ref}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-neutral-900 border border-white/20 sm:rounded-3xl rounded-xl overflow-hidden shadow-2xl overflow-y-auto"
            >
              <div className="relative flex-shrink-0">
                <motion.div
                  layoutId={`image-${item.id}-${id}`}
                  className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden bg-[#111111]"
                >
                  <img
                    src="/bg.png"
                    alt="bgimg"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 object-contain object-bottom"
                  />
                </motion.div>
                <div className="absolute top-4 right-4 z-[101]">
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

              <div className="p-4 sm:p-6 md:p-8 flex flex-col bg-neutral-950">
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-4">
                  <motion.h1
                    layoutId={`title-${item.id}-${id}`}
                    className="font-bold text-xl sm:text-2xl md:text-3xl text-white"
                  >
                    {item.title}
                  </motion.h1>
                </div>

                <div className="flex flex-col gap-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Project Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple/15 border border-purple/25 text-purple-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-base text-neutral-300 md:text-lg w-full leading-relaxed">
                      {item.des}
                    </p>
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mt-4">
                        <p className="text-white font-semibold mb-2">
                          Key Highlights:
                        </p>
                        <ul className="list-disc list-inside text-sm md:text-base text-neutral-300 space-y-1">
                          {item.highlights.map(
                            (highlight: string, idx: number) => (
                              <li key={idx}>
                                <span className="-ml-2">{highlight}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </motion.div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mt-3 sm:mt-4 pt-4 sm:pt-6 border-t border-white/10">
                    <motion.div
                      layoutId={`icons-${item.id}-${id}`}
                      className="flex items-center gap-1"
                    >
                      {item.iconLists.map((icon: string, index: number) => (
                        <div
                          key={index}
                          className="border border-white/[.2] rounded-full bg-black/50 lg:w-12 lg:h-12 w-10 h-10 flex justify-center items-center backdrop-blur-md"
                          style={{
                            transform: `translateX(-${5 * index}px)`,
                            marginLeft: index === 0 ? 0 : "-8px",
                          }}
                        >
                          <img
                            src={icon}
                            alt={`icon${index}`}
                            className={`p-2 w-full h-full object-contain ${icon === "/express.svg" ? "invert" : ""}`}
                          />
                        </div>
                      ))}
                    </motion.div>

                    <motion.a
                      layoutId={`button-${item.id}-${id}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-center items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-colors w-full sm:w-auto text-sm md:text-base"
                    >
                      Check on Github
                      <FaLocationArrow className="ms-2" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${item.id}-${id}`}
        onClick={(e) => {
          // Prevent opening modal if the user actually clicked the Pin's anchor link
          if ((e.target as HTMLElement).closest("a")) return;
          setActive(true);
        }}
        className="relative group cursor-pointer w-full"
      >
        <PinContainer title={item.link} href={item.link}>
          <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10 transition-transform duration-300 group-hover:scale-[1.02]">
            <motion.div
              layoutId={`image-${item.id}-${id}`}
              className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl lg:rounded-3xl bg-[#111111]"
            >
              <img
                src="/bg.png"
                alt="bgimg"
                className="w-full h-full object-cover"
              />
              <img
                src={item.img}
                alt="cover"
                className="z-10 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[85%] object-contain"
              />
            </motion.div>
          </div>

          <motion.h1
            layoutId={`title-${item.id}-${id}`}
            className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1 mb-2 text-white"
          >
            {item.title}
          </motion.h1>

          <p className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2 text-[#BEC1DD] mb-6">
            {item.des}
          </p>

          <div className="flex items-center justify-between">
            <motion.div
              layoutId={`icons-${item.id}-${id}`}
              className="flex items-center"
            >
              {item.iconLists.map((icon: string, index: number) => (
                <div
                  key={index}
                  className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                  style={{
                    transform: `translateX(-${5 * index + 2}px)`,
                  }}
                >
                  <img
                    src={icon}
                    alt={`icon${index}`}
                    className={`p-2 ${icon === "/express.svg" ? "invert" : ""}`}
                  />
                </div>
              ))}
            </motion.div>

            <motion.div
              layoutId={`button-${item.id}-${id}`}
              className="flex justify-center items-center"
            >
              <p className="flex lg:text-xl md:text-xs text-sm text-purple group-hover:text-white transition-colors">
                Check on Github
              </p>
              <FaLocationArrow className="ms-3 text-[#CBACF9] group-hover:text-white transition-colors" />
            </motion.div>
          </div>
        </PinContainer>
      </motion.div>
    </>
  );
}
