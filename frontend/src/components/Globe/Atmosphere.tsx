import { useMemo } from "react";
import * as THREE from "three";
import { ATMOSPHERE_RADIUS, COLORS_HEX } from "../../constants";

/** Custom shader for atmospheric glow effect around the globe */
const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(glowColor, intensity * 0.4);
  }
`;

/** Renders a soft atmospheric glow around the globe edge */
export function Atmosphere(): React.JSX.Element {
  const uniforms = useMemo(
    () => ({
      glowColor: {
        value: new THREE.Color(COLORS_HEX.atmosphereGlow),
      },
    }),
    []
  );

  return (
    <mesh scale={ATMOSPHERE_RADIUS}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
