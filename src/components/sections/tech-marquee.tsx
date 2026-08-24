"use client";

import { techLogos } from "@/components/reactbits/tech-logos";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import "./tech-marquee.css";

// Decorative "powered by" strip crediting the real stack this project is built
// on. Under prefers-reduced-motion it renders as a single static, wrapped row
// instead of a duplicated/animated marquee track.

export function TechMarquee() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <section className="bg-brand-cream py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-semibold tracking-wide text-brand-navy/50 uppercase">
            Powered by
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {techLogos.map(({ name, Logo }) => (
              <div key={name} className="flex items-center gap-2 text-brand-navy/60">
                <Logo className="size-6" aria-hidden="true" />
                <span className="text-sm font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-cream py-14">
      <p className="text-center text-xs font-semibold tracking-wide text-brand-navy/50 uppercase">
        Powered by
      </p>
      <div className="tech-marquee-viewport mt-6">
        <div className="tech-marquee-track">
          {[...techLogos, ...techLogos].map(({ name, Logo }, i) => (
            <div
              key={`${name}-${i}`}
              className="flex items-center gap-2 text-brand-navy/60"
            >
              <Logo className="size-6" aria-hidden="true" />
              <span className="text-sm font-medium whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
