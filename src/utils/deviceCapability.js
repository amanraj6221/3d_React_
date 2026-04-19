/**
 * Detects device 3D rendering capability
 * Returns: 'high' | 'medium' | 'low'
 *
 * high  → strong phone (iPhone 12+, Samsung S21+) → Full 3D
 * medium → mid-range phone → Reduced 3D
 * low   → old/weak phone  → Static fallback
 */
export function getDeviceCapability() {
  // Not mobile → always high (desktop)
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return "high";

  let score = 0;

  // 1. RAM check (navigator.deviceMemory — Chrome/Android only)
  const ram = navigator.deviceMemory; // in GB, e.g. 2, 4, 8
  if (ram >= 6) score += 3;
  else if (ram >= 4) score += 2;
  else if (ram >= 2) score += 1;
  // undefined (Safari/Firefox) → neutral, score stays

  // 2. CPU cores
  const cores = navigator.hardwareConcurrency;
  if (cores >= 8) score += 3;
  else if (cores >= 6) score += 2;
  else if (cores >= 4) score += 1;

  // 3. Pixel ratio (high-end phones have 3x)
  const dpr = window.devicePixelRatio;
  if (dpr >= 3) score += 2;
  else if (dpr >= 2) score += 1;

  // 4. WebGL capability test
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return "low"; // no WebGL at all → low

    const renderer = gl.getParameter(gl.RENDERER) || "";
    const vendor = gl.getParameter(gl.VENDOR) || "";

    // Apple GPU on new iPhones is very capable
    if (renderer.includes("Apple") || vendor.includes("Apple")) score += 3;

    // Adreno 6xx/7xx = strong Android GPU
    if (renderer.match(/Adreno.*(6[0-9]{2}|7[0-9]{2})/)) score += 3;
    else if (renderer.match(/Adreno.*(5[0-9]{2})/)) score += 1;

    // Mali-G7x/G8x = strong
    if (renderer.match(/Mali-G(7|8)[0-9]/)) score += 2;
  } catch (e) {
    return "low";
  }

  // Score decision
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

/**
 * Hook to get device capability once on mount
 */
import { useState, useEffect } from "react";

export function useDeviceCapability() {
  const [capability, setCapability] = useState("high"); // default high, update after mount

  useEffect(() => {
    setCapability(getDeviceCapability());
  }, []);

  return capability;
}
