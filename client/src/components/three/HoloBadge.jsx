import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";

const styleByVariant = {
  projects: { geom: "knot", labelY: -1.45 },
  skills: { geom: "icosa", labelY: -1.42 },
  about: { geom: "icosa", labelY: -1.42 },
  contact: { geom: "torus", labelY: -1.42 },
};

function BadgeCore({ tone, variant }) {
  const mainRef = useRef(null);
  const ringRef = useRef(null);
  const sparksRef = useRef(null);
  const beamRef = useRef(null);
  const style = styleByVariant[variant] || styleByVariant.projects;

  const sparkPositions = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = THREE.MathUtils.randFloat(1.4, 2.2);
      const t = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(t) * r;
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(0.9);
      positions[i * 3 + 2] = Math.sin(t) * r;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (mainRef.current) {
      mainRef.current.rotation.y += delta * 0.55;
      mainRef.current.rotation.x = Math.sin(t * 0.7) * 0.25;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.8;
    if (sparksRef.current) sparksRef.current.rotation.y -= delta * 0.08;
    if (beamRef.current) {
      beamRef.current.rotation.y += delta * 0.35;
      beamRef.current.rotation.x = Math.sin(t * 0.9) * 0.2;
    }
  });

  return (
    <group>
      <Float speed={1.25} rotationIntensity={0.6} floatIntensity={0.9}>
        {style.geom === "knot" ? (
          <mesh ref={mainRef}>
            <torusKnotGeometry args={[0.72, 0.19, 100, 14]} />
            <meshPhysicalMaterial color={tone} roughness={0.2} metalness={0.85} clearcoat={1} emissive={tone} emissiveIntensity={0.35} />
          </mesh>
        ) : null}
        {style.geom === "icosa" ? (
          <mesh ref={mainRef}>
            <icosahedronGeometry args={[0.82, 1]} />
            <meshStandardMaterial color={tone} wireframe emissive={tone} emissiveIntensity={0.32} />
          </mesh>
        ) : null}
        {style.geom === "torus" ? (
          <mesh ref={mainRef}>
            <torusGeometry args={[0.8, 0.25, 16, 70]} />
            <meshPhysicalMaterial color={tone} roughness={0.22} metalness={0.8} clearcoat={1} emissive={tone} emissiveIntensity={0.3} />
          </mesh>
        ) : null}
      </Float>

      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0.4, 0]}>
        <torusGeometry args={[1.15, 0.02, 18, 120]} />
        <meshStandardMaterial color="#a5f3fc" emissive="#67e8f9" emissiveIntensity={0.4} />
      </mesh>

      <mesh ref={beamRef} rotation={[0.2, 0, 0.5]}>
        <torusGeometry args={[1.45, 0.008, 8, 90]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
      </mesh>

      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={sparkPositions.length / 3} array={sparkPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#7dd3fc" size={0.018} transparent opacity={0.8} depthWrite={false} />
      </points>
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.3, delta * 2.2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.2, delta * 2.2);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const tones = {
  projects: "#818cf8",
  skills: "#22d3ee",
  about: "#7dd3fc",
  contact: "#38bdf8",
};

const HoloBadge = ({ label = "PORTFOLIO", variant = "projects" }) => {
  const tone = tones[variant] || tones.projects;
  const style = styleByVariant[variant] || styleByVariant.projects;

  return (
    <Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 3.4], fov: 48 }} gl={{ powerPreference: "high-performance", antialias: false }}>
      <color attach="background" args={["#050912"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={1.3} color="#67e8f9" />
      <pointLight position={[-2, -1, -2]} intensity={0.8} color="#818cf8" />
      <CameraRig />
      <BadgeCore tone={tone} variant={variant} />
      <Text
        position={[0, style.labelY, 0]}
        fontSize={0.18}
        color="#dbeafe"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#1e3a8a"
      >
        {label}
      </Text>
    </Canvas>
  );
};

export default HoloBadge;
