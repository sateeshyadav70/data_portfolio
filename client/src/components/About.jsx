import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import SectionReveal from "./ui/SectionReveal";
import { aboutData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";

const HoloBadge = lazy(() => import("./three/HoloBadge"));

const About = () => {
  return (
    <SectionReveal id="about" className="section-shell section-divider">
      <SectionShaderLayer variant="about" />
      <div className="section-container relative z-10">
        <div className="mb-12 grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p className="section-kicker">Origin Story</p>
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle lg:mx-0">{aboutData.headline}</p>
          </div>
          <div className="glass-panel mx-auto h-[210px] w-full max-w-[360px] overflow-hidden">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-slate-300">Loading 3D...</div>}>
              <HoloBadge label="ABOUT CORE" variant="about" />
            </Suspense>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            whileHover={{ y: -4, rotateX: 2, rotateY: -2, scale: 1.01 }}
            style={{ transformStyle: "preserve-3d" }}
            className="glass-panel space-y-4 p-6 [transform:perspective(1200px)]"
          >
            {aboutData.paragraphs.map((paragraph) => (
              <p key={paragraph} className="section-body">
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -4, rotateX: 2, rotateY: 2, scale: 1.01 }}
              style={{ transformStyle: "preserve-3d" }}
              className="glass-panel p-6 [transform:perspective(1200px)]"
            >
              <h3 className="card-title">Quick Facts</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {aboutData.quickFacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -4, rotateX: -1, rotateY: 2, scale: 1.01 }}
              style={{ transformStyle: "preserve-3d" }}
              className="glass-panel p-6 [transform:perspective(1200px)]"
            >
              <h3 className="card-title">Working Style</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {aboutData.workingStyle.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  );
};

export default About;
