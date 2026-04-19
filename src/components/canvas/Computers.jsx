import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import { motion } from "framer-motion";

import CanvasLoader from "../Loader";
import { useDeviceCapability } from "../../utils/deviceCapability";

// ─── Full desktop PC model ────────────────────────────────────────────────────
const Computers = ({ scale, position }) => {
  const computer = useGLTF("/desktop_pc/scene.gltf");
  return (
    <mesh>
      <hemisphereLight intensity={0.3} groundColor="black" />
      <pointLight intensity={0.8} />
      <primitive
        object={computer.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

// ─── Lightweight 3D for medium-capability mobile ──────────────────────────────
const LightComputer = () => (
  <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[3, 2, 0.15]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
    <mesh position={[0, 0, 0.09]}>
      <boxGeometry args={[2.7, 1.7, 0.01]} />
      <meshStandardMaterial color="#915EFF" emissive="#915EFF" emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[0, -1.3, 0]}>
      <boxGeometry args={[0.2, 0.6, 0.15]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, -1.65, 0]}>
      <boxGeometry args={[1.2, 0.1, 0.5]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, -2.1, 0.6]} rotation={[-0.3, 0, 0]}>
      <boxGeometry args={[2.5, 0.08, 0.9]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 5, 5]} intensity={1} />
    <pointLight position={[0, 0, 2]} color="#915EFF" intensity={1.5} />
  </Float>
);

// ─── Static fallback for old/weak phones ─────────────────────────────────────
const StaticFallback = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="w-full h-full flex flex-col justify-center items-center gap-6"
  >
    <motion.div
      className="w-[260px] rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "#1d1836", border: "1px solid #915EFF44" }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#151030" }}>
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-400">portfolio.jsx</span>
      </div>
      <div className="px-4 py-4 space-y-2 font-mono text-xs">
        <div><span className="text-purple-400">const</span> <span className="text-blue-300">dev</span> <span className="text-white">= {"{"}</span></div>
        <div className="ml-4"><span className="text-green-300">name</span><span className="text-white">: </span><span className="text-yellow-300">"Aman Raj"</span><span className="text-white">,</span></div>
        <div className="ml-4"><span className="text-green-300">role</span><span className="text-white">: </span><span className="text-yellow-300">"Full Stack"</span><span className="text-white">,</span></div>
        <div className="ml-4"><span className="text-green-300">sih</span><span className="text-white">: </span><span className="text-yellow-300">"3x Finalist"</span></div>
        <div><span className="text-white">{"}"}</span></div>
        <motion.span className="text-purple-400 block mt-2" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>▋</motion.span>
      </div>
    </motion.div>
    <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
      {["React", "Node.js", "Django", "MongoDB"].map((tech) => (
        <span key={tech} className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: "rgba(145,94,255,0.25)", border: "1px solid #915EFF88" }}>
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
);

// ─── Main export ──────────────────────────────────────────────────────────────
const ComputersCanvas = () => {
  const capability = useDeviceCapability();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (capability === "low") {
    return (
      <div className="w-full h-[420px] flex justify-center items-center">
        <StaticFallback />
      </div>
    );
  }

  if (capability === "medium") {
    return (
      <div className="w-full h-[380px]">
        <Canvas
          frameloop="always"
          dpr={1}
          camera={{ position: [0, 0, 8], fov: 40 }}
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
            <LightComputer />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  // HIGH — full model
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] mt-10">
      <Canvas
        frameloop="demand"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ antialias: !isMobile, powerPreference: isMobile ? "low-power" : "high-performance" }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} autoRotate enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
          <Computers
            scale={isMobile ? 0.55 : 0.75}
            position={isMobile ? [0, -3.5, -2] : [0, -3.75, -1.5]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ComputersCanvas;
