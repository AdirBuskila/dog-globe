/**
 * Shared module-level state for pin spread positions.
 * PinSpreader writes, BreedPin reads — no React re-renders needed.
 */
import * as THREE from "three";

/** Spread-adjusted positions for each breed (keyed by breed id) */
export const spreadPositions = new Map<string, THREE.Vector3>();

/** 0 = geographic positions, 1 = fully spread */
export let spreadFactor = 0;

/** Update the current spread factor */
export function setSpreadFactor(f: number): void {
  spreadFactor = f;
}
