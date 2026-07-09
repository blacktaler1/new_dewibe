import {
  Code,
  DeviceMobile,
  Palette,
  RocketLaunch,
  Sparkle,
  Stack,
} from "@phosphor-icons/react/dist/ssr";
import { lt } from "@/lib/i18n";
import type { Locale, ServiceIcon, SiteCopy } from "@/lib/types";
import SectionHeader from "./SectionHeader";

const ICON_MAP = {
  palette: Palette,
  code: Code,
  sparkle: Sparkle,
  deviceMobile: DeviceMobile,
  stack: Stack,
  rocket: RocketLaunch,
} satisfies Record<ServiceIcon, typeof Palette>;

interface ServicesSectionProps {
  copy: SiteCopy["services"];
  locale: Locale;
}

export default function ServicesSection({ copy, locale }: ServicesSectionProps) {
  return (
    <section id="services" className="section">
      <div className="section-inner">
        <SectionHeader
          label={lt(copy.label, locale)}
          title={lt(copy.title, locale)}
          description={lt(copy.description, locale)}
        />

        <div className="services-grid">
          {copy.items.map((service, index) => {
            const Icon = ICON_MAP[service.icon];

            return (
              <article key={service.id} className="service-card glass-card cursor-target">
                <div className="service-card-top">
                  <span className="service-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="service-icon-wrap">
                    <Icon size={24} weight="duotone" />
                  </div>
                </div>

                <h3 className="service-title">{lt(service.title, locale)}</h3>
                <p className="service-desc">{lt(service.description, locale)}</p>

                <ul className="service-features">
                  {(service.features[locale] ?? service.features.en).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="services-cta">
          <p className="services-cta-text">{lt(copy.ctaText, locale)}</p>
          <a href="#contact" className="btn btn-primary cursor-target">
            {lt(copy.ctaButton, locale)}
          </a>
        </div>
      </div>
    </section>
  );
}
