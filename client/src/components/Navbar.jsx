import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
  { href: "#resume", label: "Resume" },
];

const Navbar = ({ glowMode = false, onGlowToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-3"}`}>
      <nav className={`mx-auto w-[min(1120px,94%)] rounded-2xl border border-white/10 px-4 backdrop-blur-xl ${isScrolled ? "bg-slate-950/80 shadow-[0_16px_40px_rgba(0,0,0,0.35)]" : "bg-slate-950/55"}`}>
        <div className="flex h-14 items-center justify-between">
          <a href="#home" className="text-lg font-semibold tracking-wide text-white sm:text-xl">
            SK Orbit
          </a>

          <div className="hidden md:flex md:items-center md:gap-5">
            {navLinks.map((link) =>
              link.href === "#resume" ? (
                <Link key={link.href} to="/resume" className="text-sm text-slate-300 transition hover:text-cyan-200">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-cyan-200">
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGlowToggle}
              className={`nav-glow-logo ${glowMode ? "nav-glow-logo-on" : ""}`}
              aria-label="Toggle glow mode"
              title={glowMode ? "Glow Mode: ON" : "Glow Mode: OFF"}
            >
              <span className="nav-glow-glyph" />
              <span className="hidden sm:inline">{glowMode ? "Glow" : "Aura"}</span>
            </button>

            <button onClick={() => setIsMenuOpen((prev) => !prev)} className="rounded-md p-2 text-slate-200 md:hidden" aria-label="Toggle menu">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/10 py-3 md:hidden">
            <div className="space-y-2">
              {navLinks.map((link) =>
                link.href === "#resume" ? (
                  <Link
                    key={link.href}
                    to="/resume"
                    className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

