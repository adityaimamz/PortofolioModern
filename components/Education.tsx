"use client";

import React from "react";
import { educationData, certifications } from "@/data";
import { motion } from "framer-motion";
import { EvervaultCard } from "./ui/evervault-card";

const Education = () => {
  return (
    <section className="py-20" id="education">
      <h1 className="heading">
        Education & <span className="text-purple">Certifications</span>
      </h1>

      <div className="w-full mt-12 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Education Column */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple">🎓</span> Education
          </h2>
          <div className="flex flex-col gap-6">
            {educationData.map((edu, index) => (
              <motion.div
                key={edu.id}
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
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">
                      {edu.degree}
                    </h3>
                    <span className="text-purple text-xs font-semibold bg-purple/10 px-3 py-1 rounded-full whitespace-nowrap ml-2">
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
            <span className="text-purple">📜</span> Certifications
          </h2>
          <div className="flex flex-col gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl border border-white/[0.1] overflow-hidden group hover:border-purple/30 transition-colors duration-300"
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
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
                    <span className="text-purple text-lg">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-white truncate">
                      {cert.name}
                    </h3>
                    <p className="text-white-200 text-xs mt-1">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
