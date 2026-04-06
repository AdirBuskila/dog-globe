/**
 * Pre-computes a fixed lat/lng grid covering the entire globe.
 * Each breed is assigned to the nearest available grid cell.
 * Positions are computed ONCE when breeds change — not per frame.
 * Only spreadFactor (zoom-based) updates each frame.
 */
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { latLngTo3D } from "./useLatLngTo3D";
import { PIN_RADIUS } from "../../constants";
import { spreadPositions, setSpreadFactor } from "./pinSpread";
import type { Breed } from "../../types/breed";

/** Grid cell size in degrees */
const CELL_DEG = 3;

/** Zoom thresholds */
const GRID_START_DIST = 2.0;
const GRID_FULL_DIST = 1.7;

interface PinSpreaderProps {
  breeds: Breed[];
}

/** Convert lat/lng to grid cell key */
function cellKey(latCell: number, lngCell: number): string {
  return `${latCell},${lngCell}`;
}

/** Assign each breed to the nearest available grid cell */
function computeGridAssignments(breeds: Breed[]): Map<string, THREE.Vector3> {
  const result = new Map<string, THREE.Vector3>();
  const occupied = new Set<string>();

  // Sort breeds so higher-popularity breeds get priority for their ideal cell
  const sorted = [...breeds].sort((a, b) => {
    const pa = a.popularity_rank ?? 999;
    const pb = b.popularity_rank ?? 999;
    return pa - pb;
  });

  for (const breed of sorted) {
    const idealLatCell = Math.round(breed.origin_lat / CELL_DEG);
    const idealLngCell = Math.round(breed.origin_lng / CELL_DEG);

    // Spiral search for nearest empty cell
    let found = false;
    for (let radius = 0; radius <= 30 && !found; radius++) {
      for (let dlat = -radius; dlat <= radius && !found; dlat++) {
        for (let dlng = -radius; dlng <= radius && !found; dlng++) {
          // Only check the ring at this radius, not the interior
          if (Math.abs(dlat) !== radius && Math.abs(dlng) !== radius) continue;

          const latC = idealLatCell + dlat;
          const lngC = idealLngCell + dlng;
          const key = cellKey(latC, lngC);

          if (!occupied.has(key)) {
            occupied.add(key);
            const cellLat = latC * CELL_DEG;
            const cellLng = lngC * CELL_DEG;
            result.set(breed.id, latLngTo3D(cellLat, cellLng, PIN_RADIUS));
            found = true;
          }
        }
      }
    }

    // Fallback: use geographic position
    if (!found) {
      result.set(
        breed.id,
        latLngTo3D(breed.origin_lat, breed.origin_lng, PIN_RADIUS)
      );
    }
  }

  return result;
}

/** Computes grid positions once, updates spreadFactor each frame */
export function PinSpreader({ breeds }: PinSpreaderProps): null {
  const prevBreedIds = useRef<string>("");

  // Recompute grid only when breed list changes
  const breedIds = breeds.map((b) => b.id).join(",");
  if (breedIds !== prevBreedIds.current) {
    prevBreedIds.current = breedIds;
    const assignments = computeGridAssignments(breeds);
    // Copy into the shared module-level map
    spreadPositions.clear();
    for (const [id, pos] of assignments) {
      spreadPositions.set(id, pos);
    }
  }

  // Only thing that runs per frame: update spread factor based on zoom
  useFrame((state) => {
    const camDist = state.camera.position.length();
    const factor = THREE.MathUtils.clamp(
      (GRID_START_DIST - camDist) / (GRID_START_DIST - GRID_FULL_DIST),
      0,
      1
    );
    setSpreadFactor(factor);
  });

  return null;
}
