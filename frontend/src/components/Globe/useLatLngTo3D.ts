import * as THREE from "three";

/**
 * Converts latitude/longitude coordinates to a 3D position on a sphere.
 * Uses standard spherical coordinate conversion.
 * @param lat - Latitude in degrees (-90 to 90)
 * @param lng - Longitude in degrees (-180 to 180)
 * @param radius - Sphere radius
 * @returns THREE.Vector3 position on the sphere surface
 */
export function latLngTo3D(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}
