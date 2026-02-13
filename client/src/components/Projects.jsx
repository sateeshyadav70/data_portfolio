import React, { lazy, Suspense } from "react";
import SectionReveal from "./ui/SectionReveal";
import ProjectCard from "./ProjectCard";
import { projectsData } from "../data/portfolioData";
import SectionShaderLayer from "./three/SectionShaderLayer";

const HoloBadge = lazy(() => import("./three/HoloBadge"));

const Projects = () => {
  return (
    <SectionReveal id="projects" className="section-shell section-divider">
      <SectionShaderLayer variant="projects" />
      <div className="section-container relative z-10">
        <div className="mb-12 grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <p className="section-kicker">Build Archive</p>
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle lg:mx-0">A curated mix of visual engineering, utility tools, and full-stack execution.</p>
          </div>
          <div className="glass-panel mx-auto h-[210px] w-full max-w-[360px] overflow-hidden">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-slate-300">Loading 3D...</div>}>
              <HoloBadge label="PROJECT NEXUS" variant="projects" />
            </Suspense>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

export default Projects;
