import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { useGlobeStore } from "../../store/useGlobeStore";
import { latLngTo3D } from "./useLatLngTo3D";
import { PIN_RADIUS, PIN_BASE_SCALE, PIN_HOVER_SCALE } from "../../constants";
import type { Breed } from "../../types/breed";

interface BreedPinProps {
  breed: Breed;
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

/** Individual breed thumbnail pinned to the globe surface */
export function BreedPin({ breed }: BreedPinProps): React.JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectBreed = useGlobeStore((s) => s.selectBreed);
  const hoverBreed = useGlobeStore((s) => s.hoverBreed);

  const position = useMemo(
    () => latLngTo3D(breed.origin_lat, breed.origin_lng, PIN_RADIUS),
    [breed.origin_lat, breed.origin_lng]
  );

  const texture = useTextureAsync(breed.image);

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

  /** Smooth scale animation on hover */
  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = hovered
      ? PIN_BASE_SCALE * PIN_HOVER_SCALE
      : PIN_BASE_SCALE;
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.15);
    meshRef.current.scale.setScalar(newScale);
  });

  return (
    <Billboard position={position}>
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
          opacity={texture ? 1.0 : 0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {hovered && (
        <mesh scale={PIN_BASE_SCALE * PIN_HOVER_SCALE * 1.15}>
          <ringGeometry args={[0.9, 1.05, 32]} />
          <meshBasicMaterial
            color={0x00ffb3}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </Billboard>
  );
}
