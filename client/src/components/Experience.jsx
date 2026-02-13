import React from "react";
import { motion } from "framer-motion";
import SectionReveal from "./ui/SectionReveal";
import { experienceData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";

const Experience = () => {
  return (
    <SectionReveal id="experience" className="section-shell section-divider">
      <SectionShaderLayer variant="experience" />
      <div className="section-container relative z-10">
        <div className="mb-12 text-center">
          <p className="section-kicker">Execution Timeline</p>
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">A growth path focused on shipping, refining, and scaling product quality.</p>
        </div>

        <div className="timeline-wrap">
          {experienceData.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.role}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="timeline-card glass-panel"
            >
              <div className="timeline-dot" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-100">{item.role}</h3>
                <p className="text-sm text-slate-300">{item.company}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.summary}</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {item.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <span key={tech} className="pill-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

export default Experience;
