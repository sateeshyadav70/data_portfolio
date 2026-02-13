import React, { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ResumeCard from "./components/ResumeCard";

function App() {
  const shellRef = useRef(null);
  const [glowMode, setGlowMode] = useState(() => {
    try {
      return localStorage.getItem("glowMode") === "on";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("glowMode", glowMode ? "on" : "off");
    } catch {}
  }, [glowMode]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            ref={shellRef}
            className={`app-shell min-h-screen text-slate-100 transition-colors duration-300 ${glowMode ? "glow-mode" : ""}`}
            onMouseMove={(event) => {
              if (!shellRef.current) return;
              const rect = shellRef.current.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 100;
              const y = ((event.clientY - rect.top) / rect.height) * 100;
              shellRef.current.style.setProperty("--red-x", `${x}%`);
              shellRef.current.style.setProperty("--red-y", `${y}%`);
            }}
          >
            <div className="cursor-red-glow" />
            <Navbar glowMode={glowMode} onGlowToggle={() => setGlowMode((prev) => !prev)} />
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Experience />
              <Education />
              <Achievements />
              <Contact />
            </main>
            <Footer />
          </div>
        }
      />
      <Route path="/resume" element={<ResumeCard />} />
    </Routes>
  );
}

export default App;
