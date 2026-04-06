import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { useGlobeStore } from "../../store/useGlobeStore";
import { latLngTo3D } from "./useLatLngTo3D";
import {
  PIN_RADIUS,
  PIN_BASE_SCALE,
  PIN_HOVER_SCALE,
  PIN_STALK_HEIGHT,
  PIN_DROP_DURATION,
  PIN_DROP_START_HEIGHT,
} from "../../constants";
import { spreadPositions, spreadFactor } from "./pinSpread";
import type { Breed } from "../../types/breed";

/** Zoom threshold — below this distance, switch to grid mode */
const GRID_MODE_THRESHOLD = 2.0;

/** Pin scale in grid mode (smaller) */
const GRID_PIN_SCALE = 0.018;

interface BreedPinProps {
  breed: Breed;
  index: number;
}

/** Load texture without suspending — returns null while loading */
function useTextureAsync(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;

    loader.load(
      url,
      (tex) => {
        if (!cancelled) {
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        }
      },
      undefined,
      () => {
        /* load error — keep null */
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  return texture;
}

/** Individual breed thumbnail pinned to the globe on a stalk */
export function BreedPin({ breed, index }: BreedPinProps): React.JSX.Element {
  // === Refs for zoomed-out mode (stalks) ===
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const stalkRef = useRef<THREE.LineSegments>(null);
  const stalkDotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // === Refs for grid mode ===
  const gridMeshRef = useRef<THREE.Mesh>(null);
  const gridRingRef = useRef<THREE.Mesh>(null);
  const gridGroupRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const selectBreed = useGlobeStore((s) => s.selectBreed);
  const hoverBreed = useGlobeStore((s) => s.hoverBreed);
  const isLoading = useGlobeStore((s) => s.isLoading);

  /** The direction vector from globe center through this lat/lng (normalized) */
  const direction = useMemo(() => {
    const pos = latLngTo3D(breed.origin_lat, breed.origin_lng, 1.0);
    return pos.normalize();
  }, [breed.origin_lat, breed.origin_lng]);

  /** Surface position (base of stalk) */
  const surfacePos = useMemo(
    () => direction.clone().multiplyScalar(PIN_RADIUS),
    [direction]
  );

  /** Final pin position (top of stalk) */
  const pinPos = useMemo(
    () => direction.clone().multiplyScalar(PIN_RADIUS + PIN_STALK_HEIGHT),
    [direction]
  );

  const texture = useTextureAsync(breed.image);

  /** Track drop animation progress */
  const dropProgress = useRef(0);
  const startTime = useRef<number | null>(null);
  const staggerDelay = useMemo(() => 0.5 + index * 0.008, [index]);

  const handlePointerOver = useCallback(
    (e: THREE.Event) => {
      (e as unknown as { stopPropagation: () => void }).stopPropagation();
      setHovered(true);
      hoverBreed(breed);
      document.body.style.cursor = "pointer";
    },
    [breed, hoverBreed]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    hoverBreed(null);
    document.body.style.cursor = "auto";
  }, [hoverBreed]);

  const handleClick = useCallback(
    (e: THREE.Event) => {
      (e as unknown as { stopPropagation: () => void }).stopPropagation();
      selectBreed(breed);
    },
    [breed, selectBreed]
  );

  useFrame((state) => {
    const camDist = state.camera.position.length();
    const inGridMode = camDist < GRID_MODE_THRESHOLD && spreadFactor > 0.01;

    // ========== GRID MODE ==========
    if (inGridMode) {
      // Hide zoomed-out elements
      if (groupRef.current) groupRef.current.visible = false;
      if (stalkRef.current) stalkRef.current.visible = false;
      if (stalkDotRef.current) stalkDotRef.current.visible = false;

      // Show grid elements
      if (gridGroupRef.current) {
        gridGroupRef.current.visible = true;

        const gridPos = spreadPositions.get(breed.id);
        if (gridPos) {
          // Place directly on globe surface at grid position
          gridGroupRef.current.position.copy(gridPos);
        }
      }

      // Grid pin scale (with hover)
      if (gridMeshRef.current) {
        const targetScale = hovered
          ? GRID_PIN_SCALE * PIN_HOVER_SCALE
          : GRID_PIN_SCALE;
        const cur = gridMeshRef.current.scale.x;
        gridMeshRef.current.scale.setScalar(
          THREE.MathUtils.lerp(cur, targetScale, 0.2)
        );

        const mat = gridMeshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = texture ? 1.0 : 0.6;
      }

      // Grid hover ring
      if (gridRingRef.current) {
        const mat = gridRingRef.current.material as THREE.MeshBasicMaterial;
        const targetOp = hovered ? 0.7 : 0;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, 0.2);
        gridRingRef.current.visible = mat.opacity > 0.01;
      }

      return; // skip zoomed-out logic entirely
    }

    // ========== ZOOMED-OUT MODE (stalks) ==========

    // Hide grid elements
    if (gridGroupRef.current) gridGroupRef.current.visible = false;

    // Show zoomed-out elements
    if (stalkRef.current) stalkRef.current.visible = true;
    if (stalkDotRef.current) stalkDotRef.current.visible = true;

    if (!groupRef.current || !meshRef.current) return;
    groupRef.current.visible = true;

    // Drop animation
    if (startTime.current === null && !isLoading) {
      startTime.current = state.clock.elapsedTime;
    }

    if (startTime.current !== null) {
      const elapsed =
        state.clock.elapsedTime - startTime.current - staggerDelay;
      if (elapsed < 0) {
        dropProgress.current = 0;
      } else {
        const t = Math.min(elapsed / PIN_DROP_DURATION, 1);
        dropProgress.current = 1 - Math.pow(1 - t, 3);
      }
    }

    // Stalk height based on zoom
    const zoomFactor = THREE.MathUtils.clamp(
      (camDist - 1.8) / (2.5 - 1.8),
      0,
      1
    );
    const targetStalkHeight = PIN_STALK_HEIGHT * zoomFactor;
    const currentStalkHeight = THREE.MathUtils.lerp(
      targetStalkHeight + PIN_DROP_START_HEIGHT,
      targetStalkHeight,
      dropProgress.current
    );

    // Position pin along geographic direction
    const currentPinPos = direction
      .clone()
      .multiplyScalar(PIN_RADIUS + currentStalkHeight);
    groupRef.current.position.copy(currentPinPos);

    // Update stalk line
    if (stalkRef.current) {
      const positions = stalkRef.current.geometry.attributes.position;
      if (positions) {
        (positions as THREE.BufferAttribute).setXYZ(
          0,
          surfacePos.x,
          surfacePos.y,
          surfacePos.z
        );
        (positions as THREE.BufferAttribute).setXYZ(
          1,
          currentPinPos.x,
          currentPinPos.y,
          currentPinPos.z
        );
        positions.needsUpdate = true;
      }
    }

    // Fade in during drop
    const opacity = Math.min(dropProgress.current * 2, 1);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = texture ? opacity : opacity * 0.6;

    // Hover scale
    const targetScale = hovered
      ? PIN_BASE_SCALE * PIN_HOVER_SCALE
      : PIN_BASE_SCALE;
    const cur = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(cur, targetScale, 0.15)
    );

    // Hover ring
    if (ringRef.current) {
      const ringMat = ringRef.current.material as THREE.MeshBasicMaterial;
      const targetOp = hovered ? 0.7 : 0;
      ringMat.opacity = THREE.MathUtils.lerp(ringMat.opacity, targetOp, 0.15);
      ringRef.current.visible = ringMat.opacity > 0.01;
    }
  });

  /** Stalk line geometry */
  const stalkGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    positions[0] = surfacePos.x;
    positions[1] = surfacePos.y;
    positions[2] = surfacePos.z;
    positions[3] = pinPos.x;
    positions[4] = pinPos.y;
    positions[5] = pinPos.z;
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [surfacePos, pinPos]);

  return (
    <>
      {/* ====== ZOOMED-OUT: stalk + large pin ====== */}
      <lineSegments ref={stalkRef} geometry={stalkGeometry}>
        <lineBasicMaterial
          color={0x00ffb3}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>

      <mesh ref={stalkDotRef} position={surfacePos}>
        <circleGeometry args={[0.003, 8]} />
        <meshBasicMaterial
          color={0x00ffb3}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <group ref={groupRef} position={pinPos}>
        <Billboard>
          <mesh
            ref={meshRef}
            scale={PIN_BASE_SCALE}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          >
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial
              map={texture}
              color={texture ? 0xffffff : 0x00ffb3}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <mesh
            ref={ringRef}
            scale={PIN_BASE_SCALE * PIN_HOVER_SCALE * 1.2}
            visible={false}
          >
            <ringGeometry args={[0.85, 1.05, 32]} />
            <meshBasicMaterial
              color={0x00ffb3}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {hovered && (
            <Html
              center
              distanceFactor={2}
              style={{ pointerEvents: "none", transform: "translateY(-35px)" }}
            >
              <div
                style={{
                  background: "rgba(5, 10, 14, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0, 255, 179, 0.3)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  whiteSpace: "nowrap",
                  color: "#E8EDF0",
                  fontSize: "11px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                  {breed.name}
                </div>
                <div
                  style={{
                    color: "rgba(232, 237, 240, 0.5)",
                    fontSize: "9px",
                  }}
                >
                  {breed.origin_country}
                </div>
              </div>
            </Html>
          )}
        </Billboard>
      </group>

      {/* ====== GRID MODE: small pin on surface ====== */}
      <group ref={gridGroupRef} position={surfacePos} visible={false}>
        <Billboard>
          <mesh
            ref={gridMeshRef}
            scale={GRID_PIN_SCALE}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          >
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial
              map={texture}
              color={texture ? 0xffffff : 0x00ffb3}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <mesh
            ref={gridRingRef}
            scale={GRID_PIN_SCALE * PIN_HOVER_SCALE * 1.2}
            visible={false}
          >
            <ringGeometry args={[0.85, 1.05, 32]} />
            <meshBasicMaterial
              color={0x00ffb3}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {hovered && (
            <Html
              center
              distanceFactor={1.5}
              style={{ pointerEvents: "none", transform: "translateY(-28px)" }}
            >
              <div
                style={{
                  background: "rgba(5, 10, 14, 0.92)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0, 255, 179, 0.3)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  whiteSpace: "nowrap",
                  color: "#E8EDF0",
                  fontSize: "10px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                  {breed.name}
                </div>
                <div
                  style={{
                    color: "rgba(232, 237, 240, 0.5)",
                    fontSize: "9px",
                  }}
                >
                  {breed.origin_country}
                </div>
              </div>
            </Html>
          )}
        </Billboard>
      </group>
    </>
  );
}
