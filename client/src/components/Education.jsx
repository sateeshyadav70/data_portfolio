import React from "react";
import { motion } from "framer-motion";
import SectionReveal from "./ui/SectionReveal";
import { educationData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";
import campus1 from "../assets/campus1.5b6e13a2.webp";
import ramLakhan from "../assets/ram-lakhan-singh-yadav-college-aurangabad-bihar-ram-lakhan-singh-yadav-college-002.jpg";
import adarsh from "../assets/adarsh.jpg";

const educationImages = [campus1, ramLakhan, adarsh];

const Education = () => {
  return (
    <SectionReveal id="education" className="section-shell section-divider">
      <SectionShaderLayer variant="education" />
      <div className="section-container relative z-10">
        <div className="mb-12 text-center">
          <p className="section-kicker">Learning Path</p>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">Academic foundation that shaped my discipline, consistency, and technical direction.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {educationData.map((item, index) => (
            <motion.article
              key={item.degree}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="glass-panel overflow-hidden"
            >
              <img src={educationImages[index]} alt={item.institution} className="h-36 w-full object-cover" />
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">{item.period}</p>
                <h3 className="text-lg font-semibold text-slate-100">{item.degree}</h3>
                <p className="text-sm text-slate-300">{item.institution}</p>
                <p className="text-sm leading-relaxed text-slate-400">{item.detail}</p>
                <p className="text-sm font-medium text-cyan-200">{item.score}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

export default Education;
