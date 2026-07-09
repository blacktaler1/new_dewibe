"use client";

import SiteNav from "@/components/SiteNav";
import HeroSection from "@/components/hero/HeroSection";
import WorkSection from "@/components/sections/WorkSection";
import ServicesSection from "@/components/sections/ServicesSection";
import IntegrationHero from "@/components/ui/integration-hero";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { SiteContent } from "@/lib/types";

interface HomePageProps {
  content: SiteContent;
}

export default function HomePage({ content }: HomePageProps) {
  const { locale } = useLanguage();

  return (
    <>
      <SiteNav nav={content.copy.nav} locale={locale} />
      <main>
        <HeroSection hero={content.copy.hero} locale={locale} />
        <WorkSection
          projects={content.projects}
          copy={content.copy.work}
          locale={locale}
        />
        <ServicesSection copy={content.copy.services} locale={locale} />
        <IntegrationHero copy={content.copy.clients} locale={locale} />
        <AboutSection
          team={content.team}
          copy={content.copy.about}
          locale={locale}
        />
        <ContactSection copy={content.copy.contact} locale={locale} />
      </main>
      <SiteFooter copy={content.copy.footer} locale={locale} />
    </>
  );
}
