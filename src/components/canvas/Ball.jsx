import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { useDeviceCapability } from "../../utils/deviceCapability";

// ─── 3D Ball (full quality) ───────────────────────────────────────────────────
const Ball = ({ imgUrl, isMobile }) => {
  const [decal] = useTexture([imgUrl]);
  return (
    <Float speed={1.75} rotationIntensity={isMobile ? 0.7 : 1} floatIntensity={isMobile ? 1.5 : 2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={isMobile ? 2.3 : 2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={isMobile ? 0.9 : 1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

// ─── Flat icon fallback for low-capability phones ─────────────────────────────
const FlatIcon = ({ icon, name }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-1 rounded-2xl"
    style={{ background: "rgba(145,94,255,0.12)", border: "1px solid #915EFF44" }}
  >
    <img src={icon} alt={name} className="w-12 h-12 object-contain" />
    <span className="text-[9px] text-white opacity-60 text-center px-1 leading-tight">{name}</span>
  </div>
);

// ─── Main BallCanvas ──────────────────────────────────────────────────────────
const BallCanvas = ({ icon, name }) => {
  const capability = useDeviceCapability();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // LOW → flat icon grid (no WebGL cost at all)
  if (capability === "low") {
    return (
      <div className="w-full max-w-[112px] aspect-square">
        <FlatIcon icon={icon} name={name} />
      </div>
    );
  }

  // MEDIUM → 3D ball but lower quality settings
  if (capability === "medium") {
    return (
      <div className="w-full max-w-[112px] aspect-square">
        <Canvas
          frameloop="demand"
          dpr={1}
          gl={{ antialias: false, preserveDrawingBuffer: false, powerPreference: "low-power" }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls enableZoom={false} />
            <Ball imgUrl={icon} isMobile={true} />
          </Suspense>
          <Preload all />
        </Canvas>
      </div>
    );
  }

  // HIGH → full quality 3D ball
  return (
    <div className="w-full max-w-[140px] aspect-square">
      <Canvas
        frameloop="demand"
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          <Ball imgUrl={icon} isMobile={isMobile} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default BallCanvas;
