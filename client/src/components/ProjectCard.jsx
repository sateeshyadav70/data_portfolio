import React, { useState } from "react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, index }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50 });

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const posX = ((event.clientX - rect.left) / rect.width) * 100;
    const posY = ((event.clientY - rect.top) / rect.height) * 100;
    const x = (posX / 100 - 0.5) * 16;
    const y = (posY / 100 - 0.5) * -16;
    setTilt({ x: Number(y.toFixed(2)), y: Number(x.toFixed(2)), px: posX, py: posY });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, px: 50, py: 50 })}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        "--shine-x": `${tilt.px}%`,
        "--shine-y": `${tilt.py}%`,
      }}
      className="project-card luxury-panel project-flip-wrap"
    >
      <div className="card-shadow-projection" />
      <div className="card-shine" />
      <div className="project-glow-edge" />

      <div className="project-flip-inner">
        <div className="project-face project-face-front">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.name} className="h-44 w-full object-cover card-layer-1" />
          ) : (
            <div className="card-layer-1 flex h-44 items-center justify-center bg-gradient-to-br from-cyan-500/40 via-indigo-500/35 to-slate-800">
              <span className="text-5xl font-semibold text-white/90">{project.name.charAt(0)}</span>
            </div>
          )}

          <div className="card-layer-2 space-y-4 p-5">
            <h3 className="card-title text-lg card-layer-3">{project.name}</h3>

            <div className="card-layer-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="pill-tag">
                  {tech}
                </span>
              ))}
            </div>

            <p className="card-layer-3 text-sm leading-relaxed text-slate-300">{project.description}</p>

            <div className="card-layer-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[11px] uppercase tracking-wider text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="project-face project-face-back">
          <div className="space-y-4 p-5">
            <h3 className="card-title text-lg">{project.name} Overview</h3>

            <ul className="space-y-1 text-xs text-slate-300 sm:text-sm">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex gap-3 pt-1">
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-mini-primary">
                  Live Demo
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-mini-ghost">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
