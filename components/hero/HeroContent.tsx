import { lt } from "@/lib/i18n";
import type { Locale, SiteCopy } from "@/lib/types";

interface HeroContentProps {
  hero: SiteCopy["hero"];
  locale: Locale;
}

export default function HeroContent({ hero, locale }: HeroContentProps) {
  return (
    <div className="hero-content">
      <div className="text-wrapper">
        <h1
          className="main-title animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          {lt(hero.title, locale)}
        </h1>

        <p
          className="sub-title animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          {lt(hero.subtitle, locale)}
        </p>

        <div
          className="cta-group animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          <a href="#work" className="btn btn-primary cursor-target">
            {lt(hero.ctaPrimary, locale)}
          </a>
          <a href="#about" className="btn btn-outline cursor-target">
            {lt(hero.ctaSecondary, locale)}
          </a>
        </div>
      </div>
    </div>
  );
}
