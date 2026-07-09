import VideoBackground from "./VideoBackground";
import HeroContent from "./HeroContent";
import type { Locale, SiteCopy } from "@/lib/types";

interface HeroSectionProps {
  hero: SiteCopy["hero"];
  locale: Locale;
}

export default function HeroSection({ hero, locale }: HeroSectionProps) {
  return (
    <section id="home" className="hero-section">
      <VideoBackground />
      <HeroContent hero={hero} locale={locale} />
    </section>
  );
}
