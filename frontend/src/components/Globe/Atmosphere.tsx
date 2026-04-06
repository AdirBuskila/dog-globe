import { useMemo } from "react";
import * as THREE from "three";
import { ATMOSPHERE_RADIUS, COLORS_HEX } from "../../constants";

/** Custom shader for atmospheric glow effect around the globe */
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 glowColor;
  uniform vec3 goldColor;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    // Mix teal and gold based on vertical position for visual interest
    float goldMix = smoothstep(-0.3, 0.8, vPosition.y) * 0.25;
    vec3 finalColor = mix(glowColor, goldColor, goldMix);
    gl_FragColor = vec4(finalColor, intensity * 0.5);
  }
`;

/** Inner glow shader - subtle light from within */
const innerGlowFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  void main() {
    float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(glowColor, intensity * 0.15);
  }
`;

/** Renders a soft atmospheric glow around the globe edge */
export function Atmosphere(): React.JSX.Element {
  const outerUniforms = useMemo(
    () => ({
      glowColor: {
        value: new THREE.Color(COLORS_HEX.atmosphereGlow),
      },
      goldColor: {
        value: new THREE.Color(COLORS_HEX.secondaryAccent),
      },
    }),
    []
  );

  const innerUniforms = useMemo(
    () => ({
      glowColor: {
        value: new THREE.Color(COLORS_HEX.atmosphereGlow),
      },
    }),
    []
  );

  return (
    <>
      {/* Outer atmosphere glow */}
      <mesh scale={ATMOSPHERE_RADIUS}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={outerUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh scale={1.01}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={innerGlowFragmentShader}
          uniforms={innerUniforms}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
