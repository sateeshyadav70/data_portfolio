import React from "react";
import { motion } from "framer-motion";
import SectionReveal from "./ui/SectionReveal";
import { achievementsData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";

const Achievements = () => {
  return (
    <SectionReveal id="achievements" className="section-shell section-divider">
      <SectionShaderLayer variant="achievements" />
      <div className="section-container relative z-10">
        <div className="mb-12 text-center">
          <p className="section-kicker">Proof Of Work</p>
          <h2 className="section-title">Achievements</h2>
          <p className="section-subtitle">Milestones across certification, delivery quality, and technical consistency.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass-panel p-6">
            <h3 className="card-title">Milestones</h3>
            <div className="mt-4 space-y-4">
              {achievementsData.wins.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="card-title">Certifications</h3>
            <ul className="mt-4 space-y-3">
              {achievementsData.certifications.map((item) => (
                <li key={item} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-4 py-3 text-sm text-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6">
            <h3 className="card-title">Profiles</h3>
            <div className="mt-4 space-y-4">
              {achievementsData.profiles.map((item) => (
                <motion.div key={item.name} whileHover={{ x: 4 }} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                  <p className="text-sm text-cyan-200">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.meta}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

export default Achievements;
