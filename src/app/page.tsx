import { CtaBand } from "@/components/sections/cta-band";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Hero } from "@/components/sections/hero";
import { Insights } from "@/components/sections/insights";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { Story } from "@/components/sections/story";
import { TrustBand } from "@/components/sections/trust-band";
import { TwoColCta } from "@/components/sections/two-col-cta";

export default function Home() {
  return (
    <div className="bg-brand-cream">
      <SiteHeader />
      <Hero />
      <TrustBand />
      <Story />
      <FeatureGrid />
      <TwoColCta />
      <CtaBand />
      <Insights />
      <SiteFooter />
    </div>
  );
}
