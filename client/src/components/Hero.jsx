import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import profileImg from "../assets/202212101725146188_PhotoPath_PHOTO SAT.jpg";
import { heroData } from "../data/portfolioData";
import { getWeatherTheme } from "./api";

const HeroOrb = lazy(() => import("./three/HeroOrb"));
const WEATHER_MODES = ["morning", "thunderstorm", "winter"];
const WEATHER_MODE_LABELS = {
  morning: "morning",
  thunderstorm: "evening",
  winter: "winter",
};
const normalizeWeatherMode = (mode) => {
  if (mode === "rainy") return "thunderstorm";
  return mode;
};
const getTimeOfDay = (date = new Date()) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
};
const resolveClearModeByTime = (timeOfDay) => {
  if (timeOfDay === "morning") return "morning";
  if (timeOfDay === "day") return "day";
  if (timeOfDay === "evening") return "evening";
  return "night";
};

const Hero = () => {
  const navigate = useNavigate();
  const roles = heroData.roles;
  const { scrollY } = useScroll();
  const yMain = useTransform(scrollY, [0, 500], [0, -65]);
  const yAccent = useTransform(scrollY, [0, 500], [0, -120]);
  const glowOpacity = useTransform(scrollY, [0, 300], [1, 0.45]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [enable3D, setEnable3D] = useState(false);
  const sectionRef = useRef(null);
  const orbCardRef = useRef(null);
  const birdsAudioRef = useRef(null);
  const thunderAudioRef = useRef(null);
  const thunderStrikeAudioRef = useRef(null);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [isOrbZoomed, setIsOrbZoomed] = useState(false);
  const [weatherMode, setWeatherMode] = useState("morning");
  const [weatherEnabled, setWeatherEnabled] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherMeta, setWeatherMeta] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [thunderFlashOpacity, setThunderFlashOpacity] = useState(0);
  const [thunderWarmupOpacity, setThunderWarmupOpacity] = useState(0);
  const [isThunderStrikeActive, setIsThunderStrikeActive] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${8 + (i * 7) % 88}%`,
        top: `${5 + (i * 13) % 85}%`,
        delay: i * 0.35,
        duration: 5 + (i % 5),
      })),
    []
  );
  const morningParticles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${4 + (i * 9) % 92}%`,
        delay: i * 0.24,
        duration: 10 + (i % 5) * 1.6,
        scale: 0.45 + (i % 4) * 0.16,
      })),
    []
  );
  const morningLeafs = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        left: `${8 + (i * 11) % 86}%`,
        delay: i * 0.42,
        duration: 7 + (i % 4) * 0.8,
      })),
    []
  );
  const snowParticles = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: (i % 12) * 0.42,
        duration: 5.5 + (i % 8) * 0.55,
        drift: ((i % 7) - 3) * 7,
      })),
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [roles.length]);

  useEffect(() => {
    if (!weatherEnabled || weatherMode !== "thunderstorm") {
      setThunderFlashOpacity(0);
      setThunderWarmupOpacity(0);
      setIsThunderStrikeActive(false);
      return undefined;
    }

    let isActive = true;
    let warmupTimer = null;
    let flashStartTimer = null;
    let flashTimer = null;
    let strikeEndTimer = null;
    let soundTimer = null;
    let nextStrikeTimer = null;

    const scheduleNextStrike = () => {
      nextStrikeTimer = window.setTimeout(startWarmup, 8000 + Math.random() * 12000);
    };

    const triggerFlash = () => {
      if (!isActive) return;
      setThunderWarmupOpacity(0);
      setThunderFlashOpacity(0.3);
      setIsThunderStrikeActive(true);

      flashTimer = window.setTimeout(() => {
        if (!isActive) return;
        setThunderFlashOpacity(0);
      }, 120);

      strikeEndTimer = window.setTimeout(() => {
        if (!isActive) return;
        setIsThunderStrikeActive(false);
      }, 260);

      soundTimer = window.setTimeout(() => {
        if (!isActive) return;
        const strikePlayer = thunderStrikeAudioRef.current;
        if (!strikePlayer) return;
        strikePlayer.currentTime = 0;
        strikePlayer.volume = 0.18;
        strikePlayer.play().catch(() => {});
      }, 200);
      scheduleNextStrike();
    };

    const startWarmup = () => {
      if (!isActive) return;
      setThunderWarmupOpacity(0.2);
      warmupTimer = window.setTimeout(() => {
        if (!isActive) return;
        setThunderWarmupOpacity(0.12);
      }, 120);
      flashStartTimer = window.setTimeout(triggerFlash, 240);
    };

    scheduleNextStrike();
    return () => {
      isActive = false;
      if (nextStrikeTimer) window.clearTimeout(nextStrikeTimer);
      if (warmupTimer) window.clearTimeout(warmupTimer);
      if (flashStartTimer) window.clearTimeout(flashStartTimer);
      if (flashTimer) window.clearTimeout(flashTimer);
      if (strikeEndTimer) window.clearTimeout(strikeEndTimer);
      if (soundTimer) window.clearTimeout(soundTimer);
    };
  }, [weatherEnabled, weatherMode]);

  useEffect(() => {
    const birds = birdsAudioRef.current;
    const thunder = thunderAudioRef.current;
    if (birds) birds.pause();
    if (thunder) thunder.pause();

    if (!weatherEnabled || !soundEnabled) return;

    const player = weatherMode === "morning" || weatherMode === "day" ? birds : weatherMode === "thunderstorm" ? thunder : null;
    if (!player) return;
    player.currentTime = 0;
    player.volume = weatherMode === "thunderstorm" ? 0.12 : 0.16;
    player.play().catch(() => {
      setSoundEnabled(false);
    });
  }, [soundEnabled, weatherEnabled, weatherMode]);

  useEffect(() => {
    const isMorning = weatherEnabled && weatherMode === "morning";
    document.body.classList.toggle("morning-theme", isMorning);
    return () => {
      document.body.classList.remove("morning-theme");
    };
  }, [weatherEnabled, weatherMode]);

  const applyManualWeatherMode = (mode) => {
    setWeatherEnabled(true);
    setWeatherMode(mode);
    setTimeOfDay(getTimeOfDay());
    setWeatherError("");
  };

  const handleAutoWeatherMode = async () => {
    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported in this browser.");
      return;
    }

    setWeatherLoading(true);
    setWeatherError("");
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
      );
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const response = await getWeatherTheme({ lat, lon });

      if (!response?.success || !response?.data) {
        throw new Error(response?.message || "Weather response was invalid.");
      }

      const currentTimeOfDay = getTimeOfDay();
      const normalizedMode = normalizeWeatherMode(response.data.uiMode || "sunny");
      const resolvedMode = normalizedMode === "sunny" ? resolveClearModeByTime(currentTimeOfDay) : normalizedMode;

      setWeatherEnabled(true);
      setWeatherMode(resolvedMode);
      setTimeOfDay(currentTimeOfDay);
      setWeatherMeta(response.data);
    } catch (error) {
      setWeatherError(error?.message || "Could not fetch weather mode. Use manual mode.");
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getPerfOk = () => {
      const memory = navigator.deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 8;
      return memory >= 6 && cores >= 6;
    };
    const apply = () => setEnable3D(media.matches && !reduceMotion.matches && getPerfOk());
    apply();
    media.addEventListener("change", apply);
    reduceMotion.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      reduceMotion.removeEventListener("change", apply);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`section-shell weather-shell min-h-screen pt-20${weatherEnabled ? ` weather-${weatherMode}` : ""}${weatherEnabled && weatherMode === "thunderstorm" && isThunderStrikeActive ? " thunder-strike-active" : ""}`}
      onMouseMove={(event) => {
        if (!sectionRef.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        sectionRef.current.style.setProperty("--mx", `${x}%`);
        sectionRef.current.style.setProperty("--my", `${y}%`);

        if (!orbCardRef.current || isOrbHovered || isOrbZoomed) return;
        const cardRect = orbCardRef.current.getBoundingClientRect();
        const dx = Math.max(cardRect.left - event.clientX, 0, event.clientX - cardRect.right);
        const dy = Math.max(cardRect.top - event.clientY, 0, event.clientY - cardRect.bottom);
        const distance = Math.hypot(dx, dy);
        const nearThreshold = 240;
        const t = Math.max(0, Math.min(distance / nearThreshold, 1));
        const nextSpeed = 0.3 + t * 0.7;
        setOrbitSpeed(nextSpeed);
      }}
      onMouseLeave={() => {
        setOrbitSpeed(1);
        setIsOrbHovered(false);
      }}
    >
      <div className="hero-spotlight" />
      <div className="lightning-flash" />
      <div className={`time-tone-overlay ${weatherEnabled ? "is-active" : ""} time-${timeOfDay}`} />
      {weatherEnabled && (weatherMode === "morning" || weatherMode === "day" || weatherMode === "evening") ? (
        <div className="weather-morning-layer pointer-events-none absolute inset-0 z-[1]">
          <div className="weather-morning-sun" />
          <div className="weather-morning-rays" />
          <div className="weather-morning-cloud cloud-layer-1" />
          <div className="weather-morning-cloud cloud-layer-2" />
          <div className="weather-morning-cloud cloud-layer-3" />
          <div className="weather-morning-leaf-band">
            {morningLeafs.map((leaf) => (
              <span
                key={`leaf-${leaf.id}`}
                className="weather-morning-leaf"
                style={{
                  left: leaf.left,
                  animationDelay: `${leaf.delay}s`,
                  animationDuration: `${leaf.duration}s`,
                }}
              />
            ))}
          </div>
          <div className="weather-morning-grass" />
          {morningParticles.map((particle) => (
            <span
              key={`morning-${particle.id}`}
              className="weather-morning-particle"
              style={{
                left: particle.left,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                "--morning-scale": particle.scale,
              }}
            />
          ))}
        </div>
      ) : null}
      {weatherEnabled && weatherMode === "thunderstorm" ? (
        <div className="weather-thunder-layer pointer-events-none absolute inset-0 z-[1]">
          <div className="weather-thunder-clouds cloud-layer-1" />
          <div className="weather-thunder-clouds cloud-layer-2" />
          <div className="weather-thunder-clouds cloud-layer-3" />
          <div className="weather-thunder-fog" />
          <div className="weather-thunder-rain" />
          <div className="weather-thunder-warmup" style={{ opacity: thunderWarmupOpacity }} />
          <div className="weather-thunder-flash" style={{ opacity: thunderFlashOpacity }} />
        </div>
      ) : null}
      {weatherEnabled && weatherMode === "winter" ? (
        <div className="weather-snow-layer pointer-events-none absolute inset-0 z-[1]">
          {snowParticles.map((particle) => (
            <span
              key={`snow-${particle.id}`}
              className="weather-snowflake"
              style={{
                left: particle.left,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                "--flake-drift": `${particle.drift}px`,
              }}
            />
          ))}
        </div>
      ) : null}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: yAccent, opacity: glowOpacity }}>
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />
      </motion.div>

      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: yMain }}>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="star-particle"
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [0, -14, 0], opacity: [0.3, 0.95, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      <div className="section-container relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <p className="section-kicker">Flagship Portfolio Experience</p>
          <h1 className="hero-title flicker-text text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">{heroData.name.toUpperCase()}</h1>
          <motion.p
            key={roles[roleIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flicker-soft text-lg font-medium text-cyan-200"
          >
            {roles[roleIndex]}
          </motion.p>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{heroData.signatureLine}</p>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {heroData.intro}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#contact" className="btn-primary">
              Contact Me
            </a>
            <button type="button" onClick={() => navigate("/resume")} className="btn-ghost">
              View Resume
            </button>
            <button type="button" onClick={handleAutoWeatherMode} disabled={weatherLoading} className="btn-ghost">
              {weatherLoading ? "Detecting..." : "Weather Mode"}
            </button>
            {WEATHER_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => applyManualWeatherMode(mode)}
                className={`btn-mini-ghost capitalize${weatherEnabled && weatherMode === mode ? " weather-chip-active" : ""}`}
              >
                {WEATHER_MODE_LABELS[mode] || mode}
              </button>
            ))}
            {weatherEnabled && (weatherMode === "morning" || weatherMode === "day" || weatherMode === "thunderstorm") ? (
              <button type="button" onClick={() => setSoundEnabled((prev) => !prev)} className="btn-mini-ghost">
                {weatherMode === "thunderstorm" ? (soundEnabled ? "Ambience Off" : "Ambience On") : soundEnabled ? "Sound Off" : "Morning Ambience"}
              </button>
            ) : null}
          </div>
          {weatherError ? <p className="text-xs text-amber-300">{weatherError}</p> : null}
          {weatherEnabled && weatherMeta ? (
            <p className="text-xs uppercase tracking-[0.15em] text-slate-300/85">
              {weatherMeta.city ? `${weatherMeta.city}${weatherMeta.country ? `, ${weatherMeta.country}` : ""} ` : ""}
              {weatherMeta.tempC !== null && weatherMeta.tempC !== undefined ? ` ${Math.round(weatherMeta.tempC)} C` : ""}
              {weatherMeta.description ? `  ${weatherMeta.description}` : ""}
            </p>
          ) : null}

          <div className="flex items-center gap-4 pt-2">
            <img src={profileImg} alt="Sateesh Kumar" className="h-16 w-16 rounded-full border border-white/20 object-cover" />
            <p className="text-xs text-slate-400 sm:text-sm">Open to frontend, full-stack, and product engineering roles.</p>
          </div>

          <div className="grid max-w-lg grid-cols-3 gap-3 pt-2">
            {heroData.stats.map((item) => (
              <div key={item.label} className="glass-panel luxury-panel p-3 text-center">
                <p className="text-sm font-semibold text-cyan-200">{item.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="hero-marquee-wrap">
            <motion.div
              className="hero-marquee"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            >
              {[...heroData.marquee, ...heroData.marquee].map((item, idx) => (
                <span key={`${item}-${idx}`} className="hero-marquee-item">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          ref={orbCardRef}
          className="glass-panel luxury-panel group relative mx-auto h-[280px] w-full max-w-[480px] overflow-hidden rounded-3xl sm:h-[360px]"
          onMouseEnter={() => setIsOrbHovered(true)}
          onMouseLeave={() => {
            setIsOrbHovered(false);
            if (!isOrbZoomed) setOrbitSpeed(1);
          }}
          onClick={() => setIsOrbZoomed(true)}
        >
          {enable3D ? (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-slate-300">
                  Loading 3D scene...
                </div>
              }
            >
              <HeroOrb orbitSpeed={orbitSpeed} isPaused={isOrbHovered || isOrbZoomed} isZoomed={isOrbZoomed} weatherMode={weatherEnabled ? weatherMode : "default"} />
            </Suspense>
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(103,232,249,0.35),transparent_55%),linear-gradient(160deg,rgba(30,41,59,0.9),rgba(15,23,42,0.7))]">
              <div className="h-36 w-36 animate-spin rounded-full border border-cyan-200/40 border-t-cyan-200/90" />
            </div>
          )}
          <div className="hero-holo-frame pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_15%,rgba(255,255,255,0.22),transparent_48%)]" />
          {isOrbZoomed ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsOrbZoomed(false);
                setOrbitSpeed(1);
              }}
              className="absolute left-4 top-4 z-20 rounded-full border border-cyan-200/45 bg-slate-950/65 px-3 py-1 text-xs uppercase tracking-wide text-cyan-100 transition hover:border-cyan-100 hover:bg-slate-900/90"
            >
              Back
            </button>
          ) : null}
        </motion.div>
      </div>
      <audio ref={birdsAudioRef} loop preload="none" src="/audio/birds-ambient.mp3" />
      <audio ref={thunderAudioRef} loop preload="none" src="/audio/thunder-low.mp3" />
      <audio ref={thunderStrikeAudioRef} preload="none" src="/audio/thunder-low.mp3" />
    </section>
  );
};

export default Hero;
