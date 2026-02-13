import React, { Suspense, lazy, useEffect, useState } from "react";

const SectionShaderBg = lazy(() => import("./SectionShaderBg"));

const SectionShaderLayer = ({ variant }) => {
  const [enableCanvas, setEnableCanvas] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const getPerfOk = () => {
      const memory = navigator.deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 8;
      return memory >= 6 && cores >= 6;
    };
    const apply = () => setEnableCanvas(desktop.matches && !reduceMotion.matches && getPerfOk());
    apply();
    desktop.addEventListener("change", apply);
    reduceMotion.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      reduceMotion.removeEventListener("change", apply);
    };
  }, []);

  return (
    <div className={`section-shader-layer section-shader-${variant}`} aria-hidden="true">
      {enableCanvas ? (
        <Suspense fallback={null}>
          <SectionShaderBg variant={variant} />
        </Suspense>
      ) : null}
      <div className="section-shader-overlay" />
    </div>
  );
};

export default SectionShaderLayer;
