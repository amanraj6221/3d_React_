import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

// 🔹 3D Model
const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <primitive
      object={computer.scene}
      scale={isMobile ? 0.45 : 0.75}
      position={isMobile ? [0, -2.2, 0] : [0, -3.25, -1.5]}
      rotation={[-0.01, -0.2, -0.1]}
    />
  );
};

// 🔹 Fallback (mobile safe)
const MobileFallback = () => {
  return (
    <div className="w-full h-[320px] flex flex-col items-center justify-center text-white">
      <div className="w-[200px] h-[130px] bg-[#1d1836] rounded-xl shadow-lg flex items-center justify-center">
        <span className="text-sm opacity-70">3D Preview</span>
      </div>
      <p className="text-xs mt-3 opacity-60">Optimized for mobile 🚀</p>
    </div>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handleResize);

    return () => mq.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px]">
      {isMobile ? (
        // 🔥 Mobile safe render (no crash)
        <MobileFallback />
      ) : (
        // 🔥 Desktop full 3D
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{
            position: [20, 3, 5],
            fov: 25,
          }}
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={2}
              enableDamping
              dampingFactor={0.05}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />

            <Computers isMobile={false} />

            <Preload all />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ComputersCanvas;

// preload
useGLTF.preload("./desktop_pc/scene.gltf");