import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const variantColors = {
  about: ["#0b1224", "#12355b", "#1d4ed8"],
  skills: ["#04131f", "#0f3b52", "#0891b2"],
  projects: ["#080b1a", "#27235c", "#4f46e5"],
  experience: ["#070d1a", "#1f2937", "#2563eb"],
  education: ["#07101a", "#1e3a5f", "#0ea5e9"],
  achievements: ["#0a0a17", "#3b1f5f", "#7c3aed"],
  contact: ["#05111b", "#0f3d57", "#0ea5e9"],
};

function GradientPlane({ variant = "about" }) {
  const matRef = useRef(null);
  const palette = useMemo(() => variantColors[variant] || variantColors.about, [variant]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(palette[0]) },
      uColorB: { value: new THREE.Color(palette[1]) },
      uColorC: { value: new THREE.Color(palette[2]) },
    }),
    [palette]
  );

  return (
    <mesh>
      <planeGeometry args={[16, 9, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;

          float noise(vec2 p) {
            return sin(p.x) * sin(p.y);
          }

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.17;
            float wave = sin((uv.x * 7.0) + t) * 0.12 + cos((uv.y * 9.0) - t * 1.2) * 0.08;
            float n = noise((uv * 8.0) + vec2(t, -t)) * 0.08;
            float mixA = smoothstep(0.0, 1.0, uv.y + wave + n);
            float mixB = smoothstep(0.0, 1.0, uv.x + wave * 0.6);

            vec3 col = mix(uColorA, uColorB, mixA);
            col = mix(col, uColorC, mixB * 0.75);

            float vignette = smoothstep(1.25, 0.2, distance(uv, vec2(0.5)));
            col *= vignette;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

const SectionShaderBg = ({ variant = "about" }) => {
  return (
    <Canvas dpr={[1, 1]} camera={{ position: [0, 0, 1.8], fov: 50 }} gl={{ powerPreference: "low-power", antialias: false }}>
      <GradientPlane variant={variant} />
    </Canvas>
  );
};

export default SectionShaderBg;
