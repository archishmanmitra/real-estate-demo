"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { HeroSection } from "./_components/hero/HeroSection";
import { StatsStrip } from "./_components/hero/StatsStrip";
import { SkylineDivider } from "./_components/fx/SkylineDivider";
import { ManifestoSection } from "./_components/manifesto/ManifestoSection";
import { DiscoverySection } from "./_components/services/DiscoverySection";
import { TextParallax } from "./_components/marquee/TextParallax";
import { PropertiesList } from "./_components/properties/PropertiesList";
import { TerrainWave } from "./_components/webgl/TerrainWave";
import { FeatureSection } from "./_components/features/FeatureSection";
import { OutlineMarquee } from "./_components/fx/OutlineMarquee";
import { Footer } from "./_components/footer/Footer";

export default function Home() {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <main>
      <HeroSection />
      <StatsStrip />
      <SkylineDivider />
      <ManifestoSection />
      <DiscoverySection />
      <TextParallax />
      <PropertiesList />
      <TerrainWave />
      <FeatureSection />
      <OutlineMarquee />
      <Footer />
    </main>
  );
}
