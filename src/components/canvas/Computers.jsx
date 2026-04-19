import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <primitive
      object={computer.scene}
      scale={isMobile ? 0.5 : 0.75}
      position={isMobile ? [0, -2.5, 0] : [0, -3.25, -1.5]}
      rotation={[-0.01, -0.2, -0.1]}
    />
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <Canvas
        frameloop="demand"
        dpr={isMobile ? 1 : [1, 2]}
        camera={{
          position: isMobile ? [0, 2, 5] : [20, 3, 5],
          fov: isMobile ? 45 : 25,
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            autoRotate
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />

          <Computers isMobile={isMobile} />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ComputersCanvas;