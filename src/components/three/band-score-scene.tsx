"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { gsap } from "@/lib/gsap";
import { BAND_COUNT, BandScoreSlab, SLAB_STEP_X, SLAB_STEP_Y } from "./band-score-slab";

const PARALLAX_MAX_RAD = 0.12;
const CENTER_X = ((BAND_COUNT - 1) * SLAB_STEP_X) / 2;
const CENTER_Y = ((BAND_COUNT - 1) * SLAB_STEP_Y) / 2;
const BUILD_DROP = 1.1;

function InvalidatePump({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useFrame(() => {
    if (active) invalidate();
  });
  return null;
}

function Staircase() {
  const groupRefs = useRef<(Group | null)[]>([]);
  const rigRef = useRef<Group>(null);
  const target = useRef({ x: 0.15, y: -0.5 });
  const { gl, camera, invalidate } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0.2, 0);
    invalidate();
  }, [camera, invalidate]);

  const parallaxEnabled = useMemo(
    () => typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  useEffect(() => {
    const slabs = groupRefs.current;
    if (slabs.some((slab) => !slab)) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: gl.domElement, start: "top 80%", once: true },
      });
      slabs.forEach((slab, i) => {
        if (!slab) return;
        const at = i * 0.08;
        timeline
          .to(slab.position, { y: i * SLAB_STEP_Y - CENTER_Y, duration: 1.1, ease: "power3.out" }, at)
          .to(slab.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: "power3.out" }, at);
      });
    });

    return () => ctx.revert();
  }, [gl]);

  useFrame((state) => {
    const rig = rigRef.current;
    if (!rig) return;
    if (parallaxEnabled) {
      target.current.x = 0.15 + state.pointer.y * PARALLAX_MAX_RAD;
      target.current.y = -0.5 + state.pointer.x * PARALLAX_MAX_RAD;
    }
    rig.rotation.x += (target.current.x - rig.rotation.x) * 0.06;
    rig.rotation.y += (target.current.y - rig.rotation.y) * 0.06;
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={rigRef}>
        {Array.from({ length: BAND_COUNT }, (_, i) => {
          const band = i + 1;
          return (
            <group
              key={band}
              ref={(el) => {
                groupRefs.current[i] = el;
              }}
              position={[i * SLAB_STEP_X - CENTER_X, i * SLAB_STEP_Y - CENTER_Y - BUILD_DROP, 0]}
              scale={[1, 0.04, 1]}
            >
              <BandScoreSlab band={band} isFocus={band === BAND_COUNT} />
            </group>
          );
        })}
      </group>
    </Float>
  );
}

// Scene visibility gate: pumps Canvas invalidation (required under
// frameloop="demand") only while the canvas is on-screen and the tab is
// foregrounded, so the GPU idles once the visitor scrolls past the Hero.
function useSceneActive(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let inView = true;
    let docVisible = document.visibilityState === "visible";
    const sync = () => setActive(inView && docVisible);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(el);

    function onVisibilityChange() {
      docVisible = document.visibilityState === "visible";
      sync();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [containerRef]);

  return active;
}

export function BandScoreScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const active = useSceneActive(containerRef);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        frameloop="demand"
        dpr={dpr}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [3.4, 2.6, 6], fov: 32 }}
      >
        <InvalidatePump active={active} />
        <PerformanceMonitor onDecline={() => setDpr([1, 1])} onIncline={() => setDpr([1, 2])} />
        <color attach="background" args={["#1e293b"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 3]} intensity={1.2} />
        <Environment resolution={64}>
          <Lightformer intensity={2} color="#eef1ff" position={[0, 4, -4]} scale={[8, 4, 1]} />
          <Lightformer intensity={1} color="#4640de" position={[-4, 1, 2]} scale={[4, 4, 1]} />
          <Lightformer intensity={1.5} color="#f97316" position={[4, 0, 3]} scale={[3, 3, 1]} />
        </Environment>
        <Staircase />
        <EffectComposer>
          <Bloom luminanceThreshold={0.65} luminanceSmoothing={0.2} intensity={1.1} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
