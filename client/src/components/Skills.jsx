import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import SectionReveal from "./ui/SectionReveal";
import { skillsData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";

const HoloBadge = lazy(() => import("./three/HoloBadge"));

const Skills = () => {
  return (
    <SectionReveal id="skills" className="section-shell section-divider">
      <SectionShaderLayer variant="skills" />
      <div className="section-container relative z-10">
        <div className="mb-12 grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p className="section-kicker">Capability Map</p>
            <h2 className="section-title">Skills & Expertise</h2>
            <p className="section-subtitle lg:mx-0">I focus on practical engineering depth with product-level delivery discipline.</p>
          </div>
          <div className="glass-panel mx-auto h-[210px] w-full max-w-[360px] overflow-hidden">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-slate-300">Loading 3D...</div>}>
              <HoloBadge label="SKILLS MATRIX" variant="skills" />
            </Suspense>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {skillsData.map((category, categoryIndex) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: categoryIndex * 0.08 }}
              className="glass-panel p-6"
            >
              <h3 className="card-title mb-5">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex justify-between text-xs text-slate-300 sm:text-sm">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75, delay: categoryIndex * 0.08 + skillIndex * 0.06 }}
                        className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

export default Skills;
