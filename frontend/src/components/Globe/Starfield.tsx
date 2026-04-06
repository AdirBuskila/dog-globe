import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STAR_COUNT } from "../../constants";

/** Animated starfield background with twinkling effect */
export function Starfield(): React.JSX.Element {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const colors = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 8 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Varied sizes — most small, some larger
      starSizes[i] = 0.02 + Math.pow(Math.random(), 3) * 0.08;

      // Subtle color variation — mostly white with hints of teal/gold
      const tint = Math.random();
      if (tint < 0.05) {
        // Teal tinted
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 0.8;
      } else if (tint < 0.1) {
        // Warm tinted
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.6;
      } else {
        // White
        const brightness = 0.7 + Math.random() * 0.3;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return { geometry: geo, sizes: starSizes };
  }, []);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.04}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
