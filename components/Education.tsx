"use client";

import React from "react";
import { useTranslation } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ExpandableCertCard } from "./ui/ExpandableCertCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/Carousel";
const Education = () => {
  const { t } = useTranslation();
  const degrees = t("education.degrees") as Array<{
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  const certs = t("education.certs") as Array<{
    name: string;
    issuer: string;
    year: string;
    img?: string;
  }>;

  return (
    <section className="py-20" id="education">
      <h1 className="heading">
        {t("education.headingPrefix")}{" "}
        <span className="text-purple">{t("education.heading")}</span>
      </h1>

      <div className="w-full mt-12 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Education Column */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple">🎓</span> {t("education.educationLabel")}
          </h2>
          <div className="flex flex-col gap-6">
            {degrees.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative rounded-2xl border border-white/[0.1] overflow-hidden group"
                style={{
                  background: "rgb(15,15,15)",
                  backgroundColor:
                    "linear-gradient(90deg, rgba(15,15,15,1) 0%, rgba(30,30,30,1) 100%)",
                }}
              >
                {/* Subtle gradient glow */}
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple via-blue-500 to-purple" />
                </div>

                <div className="relative z-10 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2 sm:gap-0">
                    <h3 className="text-lg font-bold text-white">
                      {edu.degree}
                    </h3>
                    <span className="text-purple text-xs font-semibold bg-purple/10 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-white-200 text-sm font-medium mb-2">
                    {edu.institution}
                  </p>
                  <p className="text-white-100 text-sm leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications Column */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple">📜</span> {t("education.certificationsLabel")}
          </h2>
          {certs.length > 4 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {certs.map((cert, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <ExpandableCertCard cert={cert} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0 translate-x-0" />
                <CarouselNext className="static translate-y-0 translate-x-0" />
              </div>
            </Carousel>
          ) : (
            <div className="flex flex-col gap-4">
              {certs.map((cert, index) => (
                <ExpandableCertCard key={index} cert={cert} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;

