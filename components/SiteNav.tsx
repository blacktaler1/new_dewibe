"use client";

import HeroBubbleMenu from "@/components/hero/HeroBubbleMenu";
import type { Locale, SiteCopy } from "@/lib/types";

interface SiteNavProps {
  nav: SiteCopy["nav"];
  locale: Locale;
}

export default function SiteNav({ nav, locale }: SiteNavProps) {
  return <HeroBubbleMenu nav={nav} locale={locale} />;
}
