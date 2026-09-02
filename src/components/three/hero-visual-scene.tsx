"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { gsap } from "@/lib/gsap";

const PARALLAX_MAX_RAD = 0.08;

function Headphones() {
  return (
    <group position={[-1.3, 0.15, 0]}>
      {/* Headband: half-torus, its centerline circle already arcs from the
          left ear cup, over the top, to the right ear cup. */}
      <mesh>
        <torusGeometry args={[0.85, 0.07, 16, 48, Math.PI]} />
        <meshPhysicalMaterial
          color="#1e293b"
          transmission={0.4}
          thickness={0.3}
          roughness={0.25}
          ior={1.4}
          clearcoat={0.5}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[0.85 * side, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.32, 0.22, 32]} />
            <meshPhysicalMaterial color="#1e293b" roughness={0.3} clearcoat={0.4} ior={1.4} />
          </mesh>
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.035, 12, 24]} />
            <meshBasicMaterial color="#f97316" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BookPage({ sign }: { sign: 1 | -1 }) {
  return (
    <group rotation={[0, 0.35 * sign, 0]}>
      <mesh position={[0.36 * sign, 0, 0]}>
        <boxGeometry args={[0.72, 0.95, 0.03]} />
        <meshStandardMaterial color="#fffdf9" roughness={0.75} />
      </mesh>
      {[0.25, 0.05, -0.15].map((y, i) => (
        <mesh key={i} position={[0.36 * sign, y, 0.02]}>
          <boxGeometry args={[0.44, 0.035, 0.01]} />
          <meshBasicMaterial color={i === 0 ? "#f97316" : "#94a3b8"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Book() {
  return (
    <group position={[1.3, -0.1, 0]} rotation={[0.15, 0, 0]}>
      <BookPage sign={-1} />
      <BookPage sign={1} />
      <mesh>
        <boxGeometry args={[0.06, 0.95, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
    </group>
  );
}

function HeroObjects() {
  const rigRef = useRef<Group>(null);
  const headphonesRef = useRef<Group>(null);
  const bookRef = useRef<Group>(null);
  const target = useRef({ x: 0.08, y: 0 });
  const { camera, invalidate, gl } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, invalidate]);

  const parallaxEnabled = useMemo(
    () => typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  useEffect(() => {
    const headphones = headphonesRef.current;
    const book = bookRef.current;
    if (!headphones || !book) return;

    gsap.set([headphones.scale, book.scale], { x: 0.001, y: 0.001, z: 0.001 });

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: gl.domElement, start: "top 80%", once: true },
        })
        .to(headphones.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.6)" })
        .to(book.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.6)" }, "-=0.55");
    });

    return () => ctx.revert();
  }, [gl]);

  useFrame((state) => {
    const rig = rigRef.current;
    if (!rig) return;
    if (parallaxEnabled) {
      target.current.x = 0.08 + state.pointer.y * PARALLAX_MAX_RAD;
      target.current.y = state.pointer.x * PARALLAX_MAX_RAD;
    }
    rig.rotation.x += (target.current.x - rig.rotation.x) * 0.06;
    rig.rotation.y += (target.current.y - rig.rotation.y) * 0.06;
  });

  return (
    <group ref={rigRef}>
      <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={headphonesRef}>
          <Headphones />
        </group>
      </Float>
      <Float speed={1.3} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={bookRef}>
          <Book />
        </group>
      </Float>
    </group>
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

function InvalidatePump({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useFrame(() => {
    if (active) invalidate();
  });
  return null;
}

interface HeroVisualSceneProps {
  // Called once if the WebGL context is lost after the scene has mounted.
  // The parent (HeroScene) swaps to the static fallback permanently on this
  // signal, matching the existing binary reduced-motion/no-WebGL2 fallback
  // pattern rather than attempting a live in-place recovery.
  onContextLost?: () => void;
}

export function HeroVisualScene({ onContextLost }: HeroVisualSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const active = useSceneActive(containerRef);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        frameloop="demand"
        dpr={dpr}
        gl={{ antialias: true }}
        camera={{ position: [0, 0.4, 5.4], fov: 36 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onContextLost?.();
          });
        }}
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
        <HeroObjects />
      </Canvas>
    </div>
  );
}
