"use client";

import { forwardRef } from "react";
import type { Group } from "three";
import { MeshTransmissionMaterial, RoundedBox, Text } from "@react-three/drei";

export const BAND_COUNT = 9;
export const SLAB_STEP_X = 0.55;
export const SLAB_STEP_Y = 0.34;

const SLAB_WIDTH = 2.2;
const SLAB_HEIGHT = 0.32;
const SLAB_DEPTH = 1.3;
const SLAB_RADIUS = 0.06;

interface BandScoreSlabProps {
  band: number;
  isFocus: boolean;
}

// One glass step of the "Band Staircase". Bands 1-8 use a cheap navy
// meshPhysicalMaterial; band 9 alone gets drei's more expensive
// MeshTransmissionMaterial (tinted brand-orange) plus its own point light —
// the perf/quality budget is spent on the single focal slab, not all nine.
export const BandScoreSlab = forwardRef<Group, BandScoreSlabProps>(function BandScoreSlab(
  { band, isFocus },
  ref,
) {
  return (
    <group ref={ref}>
      <RoundedBox args={[SLAB_WIDTH, SLAB_HEIGHT, SLAB_DEPTH]} radius={SLAB_RADIUS} smoothness={4}>
        {isFocus ? (
          <MeshTransmissionMaterial
            color="#f97316"
            thickness={0.5}
            roughness={0.06}
            ior={1.4}
            transmission={0.95}
            chromaticAberration={0.02}
            anisotropicBlur={0.1}
            distortion={0.1}
          />
        ) : (
          <meshPhysicalMaterial
            color="#1e293b"
            transmission={0.9}
            thickness={0.4}
            roughness={0.15}
            ior={1.4}
            clearcoat={0.3}
          />
        )}
      </RoundedBox>

      <Text
        position={[0, SLAB_HEIGHT / 2 + 0.005, SLAB_DEPTH / 2 - 0.24]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.17}
        color={isFocus ? "#fff7ed" : "#e2e8f0"}
        anchorX="center"
        anchorY="middle"
      >
        {band}
      </Text>

      {isFocus && (
        <>
          <mesh position={[0, SLAB_HEIGHT / 2 + 0.14, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#fdba74" toneMapped={false} />
          </mesh>
          <pointLight color="#f97316" intensity={6} distance={3.5} position={[0, 0.7, 0]} />
        </>
      )}
    </group>
  );
});
