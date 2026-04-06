import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { GLOBE_RADIUS, GRID_SPACING_DEG } from "../../constants";

const SEGMENTS = 64;
const GRID_OPACITY = 0.12;
const EQUATOR_OPACITY = 0.3;

/** Generates a single circle of points at a given latitude */
function createLatLine(lat: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const phi = (90 - lat) * (Math.PI / 180);
  const r = GLOBE_RADIUS * 1.002;

  for (let i = 0; i <= SEGMENTS; i++) {
    const theta = (i / SEGMENTS) * Math.PI * 2;
    points.push([
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return points;
}

/** Generates a single circle of points at a given longitude */
function createLngLine(lng: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const theta = (lng + 180) * (Math.PI / 180);
  const r = GLOBE_RADIUS * 1.002;

  for (let i = 0; i <= SEGMENTS; i++) {
    const phi = (i / SEGMENTS) * Math.PI;
    points.push([
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return points;
}

interface GridLineData {
  points: [number, number, number][];
  isMain: boolean;
}

/** Renders lat/lng grid lines on the globe surface */
export function GlobeGrid(): React.JSX.Element {
  const lines = useMemo(() => {
    const result: GridLineData[] = [];

    for (let lat = -90 + GRID_SPACING_DEG; lat < 90; lat += GRID_SPACING_DEG) {
      result.push({ points: createLatLine(lat), isMain: lat === 0 });
    }

    for (let lng = -180; lng < 180; lng += GRID_SPACING_DEG) {
      result.push({ points: createLngLine(lng), isMain: lng === 0 });
    }

    return result;
  }, []);

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={new THREE.Color(0x00ffb3)}
          lineWidth={1}
          transparent
          opacity={line.isMain ? EQUATOR_OPACITY : GRID_OPACITY}
          depthWrite={false}
        />
      ))}
    </group>
  );
}
