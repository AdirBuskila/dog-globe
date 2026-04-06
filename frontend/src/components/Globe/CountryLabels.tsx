import { useMemo } from "react";
import { Billboard, Text } from "@react-three/drei";
import { latLngTo3D } from "./useLatLngTo3D";

interface LabelData {
  text: string;
  lat: number;
  lng: number;
  size: number;
}

/** Major continent and region labels */
const CONTINENT_LABELS: LabelData[] = [
  { text: "NORTH AMERICA", lat: 45, lng: -100, size: 0.06 },
  { text: "SOUTH AMERICA", lat: -15, lng: -60, size: 0.05 },
  { text: "EUROPE", lat: 54, lng: 15, size: 0.05 },
  { text: "AFRICA", lat: 5, lng: 20, size: 0.06 },
  { text: "ASIA", lat: 45, lng: 90, size: 0.06 },
  { text: "OCEANIA", lat: -25, lng: 135, size: 0.045 },
];

/** Country labels for major dog-origin countries */
const COUNTRY_LABELS: LabelData[] = [
  { text: "UK", lat: 54, lng: -2, size: 0.025 },
  { text: "Germany", lat: 51, lng: 10, size: 0.025 },
  { text: "France", lat: 46, lng: 2, size: 0.025 },
  { text: "Spain", lat: 40, lng: -4, size: 0.022 },
  { text: "Italy", lat: 42, lng: 12, size: 0.022 },
  { text: "Russia", lat: 60, lng: 50, size: 0.03 },
  { text: "Japan", lat: 36, lng: 138, size: 0.025 },
  { text: "China", lat: 35, lng: 105, size: 0.03 },
  { text: "India", lat: 22, lng: 78, size: 0.025 },
  { text: "Australia", lat: -28, lng: 134, size: 0.03 },
  { text: "USA", lat: 38, lng: -97, size: 0.03 },
  { text: "Canada", lat: 56, lng: -96, size: 0.03 },
  { text: "Mexico", lat: 23, lng: -102, size: 0.025 },
  { text: "Brazil", lat: -10, lng: -52, size: 0.03 },
  { text: "S. Africa", lat: -30, lng: 25, size: 0.022 },
  { text: "Turkey", lat: 39, lng: 35, size: 0.022 },
  { text: "S. Korea", lat: 36, lng: 128, size: 0.02 },
];

const LABEL_RADIUS = 1.04;

/** Renders country and continent labels as text sprites on the globe */
export function CountryLabels(): React.JSX.Element {
  const continentElements = useMemo(
    () =>
      CONTINENT_LABELS.map((label) => ({
        ...label,
        position: latLngTo3D(label.lat, label.lng, LABEL_RADIUS),
      })),
    []
  );

  const countryElements = useMemo(
    () =>
      COUNTRY_LABELS.map((label) => ({
        ...label,
        position: latLngTo3D(label.lat, label.lng, LABEL_RADIUS),
      })),
    []
  );

  return (
    <group>
      {/* Continent labels */}
      {continentElements.map((label) => (
        <Billboard key={label.text} position={label.position}>
          <Text
            fontSize={label.size}
            color="#F5A623"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor="#000000"
            fillOpacity={0.5}
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            letterSpacing={0.15}
          >
            {label.text}
          </Text>
        </Billboard>
      ))}

      {/* Country labels */}
      {countryElements.map((label) => (
        <Billboard key={label.text} position={label.position}>
          <Text
            fontSize={label.size}
            color="#E8EDF0"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.001}
            outlineColor="#000000"
            fillOpacity={0.35}
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          >
            {label.text}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}
