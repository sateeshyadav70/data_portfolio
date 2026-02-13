import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";

function CoreCluster({ motionScale }) {
  const groupRef = useRef(null);
  const shellRef = useRef(null);
  const glowRingRef = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      if (motionScale > 0) {
        groupRef.current.rotation.y += delta * 0.33 * motionScale;
        groupRef.current.rotation.x = Math.sin(t * 0.42) * 0.14;
      }
    }
    if (shellRef.current) {
      if (motionScale > 0) {
        shellRef.current.rotation.y += delta * 0.78 * motionScale;
        shellRef.current.rotation.z += delta * 0.22 * motionScale;
      }
    }
    if (glowRingRef.current) {
      if (motionScale > 0) {
        glowRingRef.current.rotation.z += delta * 0.4 * motionScale;
        glowRingRef.current.scale.setScalar(1 + Math.sin(t * 1.9) * 0.02);
      }
    }
  });

  return (
    <Float speed={Math.max(0, 1.15 * motionScale)} rotationIntensity={0.32} floatIntensity={1}>
      <group ref={groupRef}>
        <mesh castShadow>
          <octahedronGeometry args={[0.92, 3]} />
          <meshPhysicalMaterial
            color="#83f0ff"
            roughness={0.12}
            metalness={0.75}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#2563eb"
            emissiveIntensity={0.65}
          />
        </mesh>

        <mesh ref={shellRef} scale={1.2} castShadow>
          <icosahedronGeometry args={[1.0, 1]} />
          <meshStandardMaterial color="#7dd3fc" wireframe transparent opacity={0.21} />
        </mesh>

        <mesh ref={glowRingRef} rotation={[Math.PI / 2.8, 0.2, 0]} castShadow>
          <torusGeometry args={[1.45, 0.018, 12, 90]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.45} />
        </mesh>
      </group>
    </Float>
  );
}

function DataField({ motionScale }) {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const count = 170;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.randFloat(2.6, 5.1);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.04 * motionScale;
    pointsRef.current.rotation.x -= delta * 0.015 * motionScale;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#7dd3fc" size={0.026} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig({ isZoomed }) {
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    const scroll = typeof window === "undefined" ? 0 : window.scrollY;
    const progress = Math.max(0, Math.min(scroll / 900, 1));
    const baseZ = 4.7 - progress * 1.15;
    const yOffset = progress * 0.25;
    const zTarget = isZoomed ? 2.95 : baseZ;
    const xTarget = isZoomed ? 0 : pointer.x * 0.55;
    const yTarget = isZoomed ? 0.05 : pointer.y * 0.35 + yOffset;
    const lerpRate = isZoomed ? 2.2 : 1.8;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, xTarget, delta * lerpRate);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, yTarget, delta * lerpRate);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zTarget, delta * 1.9);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function OrbitSatellites({ motionScale }) {
  const groupRef = useRef(null);
  const satellites = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        radius: 1.85 + (i % 2) * 0.28,
        size: i % 3 === 0 ? 0.085 : 0.06,
      })),
    []
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (motionScale <= 0) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y += delta * 0.52 * motionScale;
    groupRef.current.rotation.x = Math.sin(t * 0.32) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {satellites.map((node, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(node.angle) * node.radius, Math.sin(node.angle * 1.7) * 0.36, Math.sin(node.angle) * node.radius]}
          castShadow
        >
          <sphereGeometry args={[node.size, 10, 10]} />
          <meshStandardMaterial color={idx % 2 ? "#67e8f9" : "#818cf8"} emissive={idx % 2 ? "#0e7490" : "#4338ca"} emissiveIntensity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function BeamGrid({ motionScale }) {
  const gridRef = useRef(null);
  const geom = useMemo(() => {
    const positions = [];
    const radius = 2.4;
    for (let i = 0; i < 24; i += 1) {
      const a = (i / 24) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;
      positions.push(x, -0.35, z, x, 0.35, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (!gridRef.current) return;
    if (motionScale <= 0) return;
    gridRef.current.rotation.y += delta * 0.18 * motionScale;
    gridRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <lineSegments ref={gridRef} geometry={geom}>
      <lineBasicMaterial color="#67e8f9" transparent opacity={0.22} />
    </lineSegments>
  );
}

function LightningRig() {
  const lightRef = useRef(null);
  const fillRef = useRef(null);
  const boltRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = t % 11.5;
    const strikeA = Math.exp(-Math.pow((cycle - 8.25) / 0.05, 2));
    const strikeB = Math.exp(-Math.pow((cycle - 8.45) / 0.04, 2));
    const strikeC = Math.exp(-Math.pow((cycle - 8.78) / 0.06, 2));
    const flash = Math.min(1, strikeA * 1.2 + strikeB + strikeC * 0.9);

    if (lightRef.current) lightRef.current.intensity = 0.15 + flash * 3.8;
    if (fillRef.current) fillRef.current.intensity = 0.22 + flash * 0.65;
    if (boltRef.current) boltRef.current.opacity = flash * 0.36;
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[1.4, 3.2, 2.1]}
        angle={0.34}
        penumbra={0.85}
        color="#dbeafe"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.00025}
      />
      <pointLight ref={fillRef} position={[-2.2, 1.6, -1.6]} color="#93c5fd" />
      <mesh position={[1.2, 2.7, 1.7]}>
        <planeGeometry args={[1.8, 2.6]} />
        <meshBasicMaterial ref={boltRef} color="#e2e8f0" transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

function ShadowSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
      <circleGeometry args={[3.8, 48]} />
      <shadowMaterial transparent opacity={0.24} />
    </mesh>
  );
}

function SignatureText({ motionScale }) {
  return (
    <Float speed={Math.max(0, motionScale)} rotationIntensity={0.25} floatIntensity={0.7}>
      <Text
        position={[0, -1.95, 0]}
        fontSize={0.25}
        color="#bae6fd"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#1e3a8a"
      >
        SATEESH // BUILD
      </Text>
    </Float>
  );
}

const HERO_THEME = {
  default: {
    bg: "#050912",
    fog: "#050912",
    hemi: "#a5f3fc",
    ground: "#0f172a",
    keyA: "#67e8f9",
    keyB: "#818cf8",
    spot: "#dbeafe",
  },
  sunny: {
    bg: "#11100a",
    fog: "#161409",
    hemi: "#fde68a",
    ground: "#312e1b",
    keyA: "#fbbf24",
    keyB: "#fb923c",
    spot: "#fef3c7",
  },
  morning: {
    bg: "#dbeafe",
    fog: "#bfdbfe",
    hemi: "#fef3c7",
    ground: "#bae6fd",
    keyA: "#fcd34d",
    keyB: "#7dd3fc",
    spot: "#fff7cc",
  },
  rainy: {
    bg: "#030712",
    fog: "#030712",
    hemi: "#7dd3fc",
    ground: "#111827",
    keyA: "#38bdf8",
    keyB: "#60a5fa",
    spot: "#e2e8f0",
  },
  thunderstorm: {
    bg: "#1f1045",
    fog: "#1a1038",
    hemi: "#c4b5fd",
    ground: "#312e81",
    keyA: "#93c5fd",
    keyB: "#fb923c",
    spot: "#dbeafe",
  },
  winter: {
    bg: "#020617",
    fog: "#020617",
    hemi: "#bfdbfe",
    ground: "#0f172a",
    keyA: "#bae6fd",
    keyB: "#93c5fd",
    spot: "#f8fafc",
  },
};

const HeroOrb = ({ orbitSpeed = 1, isPaused = false, isZoomed = false, weatherMode = "default" }) => {
  const motionScale = isPaused ? 0 : orbitSpeed;
  const theme = HERO_THEME[weatherMode] || HERO_THEME.default;
  const enableLightning = weatherMode === "thunderstorm" || weatherMode === "rainy";

  return (
    <Canvas
      shadows
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 4.7], fov: 45 }}
      gl={{ powerPreference: "high-performance", antialias: false }}
    >
      <color attach="background" args={[theme.bg]} />
      <fog attach="fog" args={[theme.fog, 6, 12]} />
      <ambientLight intensity={0.3} />
      <hemisphereLight intensity={0.35} color={theme.hemi} groundColor={theme.ground} />
      <pointLight position={[3.2, 2.4, 2.6]} intensity={1.4} color={theme.keyA} />
      <pointLight position={[-3, -1, -2]} intensity={1.05} color={theme.keyB} />
      <spotLight position={[0, 4, 2]} angle={0.35} intensity={1.6} penumbra={0.8} color={theme.spot} />
      {enableLightning ? <LightningRig /> : null}
      <CameraRig isZoomed={isZoomed} />
      <DataField motionScale={motionScale} />
      <BeamGrid motionScale={motionScale} />
      <OrbitSatellites motionScale={motionScale} />
      <CoreCluster motionScale={motionScale} />
      <ShadowSurface />
      <SignatureText motionScale={motionScale} />
    </Canvas>
  );
};

export default HeroOrb;
