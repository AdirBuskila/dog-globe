import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useTexture } from "@react-three/drei";
import { useGlobeStore } from "../../store/useGlobeStore";
import { useFilteredBreeds } from "../../hooks/useFilteredBreeds";
import { GlobeGrid } from "./GlobeGrid";
import { BreedPin } from "./BreedPin";
import { Starfield } from "./Starfield";
import { Atmosphere } from "./Atmosphere";
import { CountryLabels } from "./CountryLabels";
import {
  GLOBE_RADIUS,
  AUTO_ROTATE_SPEED,
  COLORS_HEX,
} from "../../constants";

/** The globe sphere with dark earth texture */
function GlobeSphere(): React.JSX.Element {
  const [earthMap, bumpMap] = useTexture([
    "/data/earth-dark.jpg",
    "/data/earth-topology.png",
  ]);

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshPhongMaterial
        map={earthMap}
        bumpMap={bumpMap}
        bumpScale={0.03}
        emissiveMap={earthMap}
        emissive={0x112244}
        emissiveIntensity={0.3}
        specular={0x222222}
        shininess={20}
      />
    </mesh>
  );
}

/** Inner Three.js scene content */
function GlobeScene(): React.JSX.Element {
  const isRotating = useGlobeStore((s) => s.isRotating);
  const filteredBreeds = useFilteredBreeds();

  return (
    <>
      {/* Lighting */}
      <ambientLight color={COLORS_HEX.ambientLight} intensity={0.8} />
      <directionalLight
        color={COLORS_HEX.directionalLight}
        intensity={1.0}
        position={[5, 3, 5]}
      />
      <directionalLight
        color={0x4488aa}
        intensity={0.4}
        position={[-5, -2, -5]}
      />
      <pointLight
        color={0x00ffb3}
        intensity={0.3}
        position={[0, 5, 0]}
        distance={10}
      />

      {/* Stars background */}
      <Starfield />

      {/* Globe */}
      <group>
        <Suspense fallback={<FallbackSphere />}>
          <GlobeSphere />
        </Suspense>
        <GlobeGrid />
        <Atmosphere />
        <CountryLabels />

        {/* Breed pins */}
        <Suspense fallback={null}>
          {filteredBreeds.map((breed) => (
            <BreedPin key={breed.id} breed={breed} />
          ))}
        </Suspense>
      </group>

      {/* Controls */}
      <OrbitControls
        autoRotate={isRotating}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        enableDamping
        dampingFactor={0.05}
        enablePan={false}
        minDistance={1.5}
        maxDistance={4}
        enableZoom
      />

      <Preload all />
    </>
  );
}

/** Simple dark sphere while texture loads */
function FallbackSphere(): React.JSX.Element {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
      <meshBasicMaterial color={0x0a1628} />
    </mesh>
  );
}

/** Main Globe canvas component */
export function Globe(): React.JSX.Element {
  return (
    <div className="absolute inset-0" aria-label="Interactive 3D dog breed globe">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#050A0E" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <GlobeScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
