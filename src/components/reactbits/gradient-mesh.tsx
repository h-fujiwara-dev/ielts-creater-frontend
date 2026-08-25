"use client";

import { memo, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import "./gradient-mesh.css";

// Original component (not a reactbits.dev port) — a fullscreen-triangle WebGL2
// fragment shader that blends three brand colors into a slowly flowing mesh
// gradient, with a subtle warp toward the cursor. No vertex buffers (draws via
// gl_VertexID) and no dependencies. Rendering is skipped when the user prefers
// reduced motion or the browser lacks WebGL2; a static CSS gradient is shown
// underneath in both cases.

const VERTEX_SRC = `#version 300 es
void main() {
  float x = (gl_VertexID == 1) ? 3.0 : -1.0;
  float y = (gl_VertexID == 2) ? 3.0 : -1.0;
  gl_Position = vec4(x, y, 0.0, 1.0);
}`;

const FRAGMENT_SRC = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv - uPointer;
  float warp = 0.05 * exp(-dot(p, p) * 6.0);
  vec2 uv2 = uv + warp * normalize(p + 1e-4);

  float t = uTime * 0.08;
  float a = sin(uv2.x * 3.1 + t * 1.3) * 0.5 + 0.5;
  float b = sin(uv2.y * 2.4 - t * 1.7 + a * 2.0) * 0.5 + 0.5;
  float c = sin((uv2.x + uv2.y) * 2.0 + t * 0.9) * 0.5 + 0.5;

  vec3 col = mix(uColorA, uColorB, a);
  col = mix(col, uColorC, b * 0.6);
  col = mix(col, uColorA, c * 0.25);

  // Kept translucent (composited over the page's own cream background) so the
  // flowing colors read as an ambient wash behind the Hero copy rather than a
  // saturated block that would fail text-contrast against brand-navy headings.
  fragColor = vec4(col, 0.08);
}`;

function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface GradientMeshProps {
  colorA?: string;
  colorB?: string;
  colorC?: string;
  className?: string;
}

export const GradientMesh = memo(function GradientMesh({
  colorA = "#fffdf9",
  colorB = "#f97316",
  colorC = "#4640de",
  className = "",
}: GradientMeshProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.useProgram(program);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uColorA = gl.getUniformLocation(program, "uColorA");
    const uColorB = gl.getUniformLocation(program, "uColorB");
    const uColorC = gl.getUniformLocation(program, "uColorC");

    gl.uniform3fv(uColorA, hexToRgb01(colorA));
    gl.uniform3fv(uColorB, hexToRgb01(colorB));
    gl.uniform3fv(uColorC, hexToRgb01(colorC));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let resizeTimer: ReturnType<typeof setTimeout>;

    function doResize() {
      const rect = parent!.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(uResolution, w, h);
    }

    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 100);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = parent!.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1 - (e.clientY - rect.top) / rect.height;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visibleRef.current;
        visibleRef.current = entry.isIntersecting;
        if (visibleRef.current && !wasVisible) {
          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );
    observer.observe(parent);

    const startTime = performance.now();

    function tick(now: number) {
      if (!visibleRef.current) return;
      const m = mouseRef.current;
      m.sx += (m.x - m.sx) * 0.05;
      m.sy += (m.y - m.sy) * 0.05;

      gl!.uniform1f(uTime, (now - startTime) / 1000);
      gl!.uniform2f(uPointer, m.sx, m.sy);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      rafRef.current = requestAnimationFrame(tick);
    }

    doResize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [prefersReducedMotion, colorA, colorB, colorC]);

  return (
    <div className={`gradient-mesh-container ${className}`} aria-hidden="true">
      <div
        className="gradient-mesh-fallback"
        style={{
          background: `linear-gradient(135deg, ${colorA}, ${colorC} 55%, ${colorB})`,
          opacity: 0.08,
        }}
      />
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
});
