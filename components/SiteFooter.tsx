"use client";

import {
  GithubLogo,
  LinkedinLogo,
  DribbbleLogo,
} from "@phosphor-icons/react";
import { Footer } from "@/components/ui/footer";
import { lt } from "@/lib/i18n";
import type { Locale, SiteCopy } from "@/lib/types";

const handleNewsletterSubscribe = async (email: string): Promise<boolean> => {
  console.log(`Subscribing ${email}...`);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return Math.random() > 0.3;
};

const socialLinksData = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: <GithubLogo className="h-5 w-5 text-muted-foreground" weight="fill" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <LinkedinLogo className="h-5 w-5 text-muted-foreground" weight="fill" />,
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com",
    icon: <DribbbleLogo className="h-5 w-5 text-muted-foreground" weight="fill" />,
  },
];

interface SiteFooterProps {
  copy: SiteCopy["footer"];
  locale: Locale;
}

export default function SiteFooter({ copy, locale }: SiteFooterProps) {
  return (
    <Footer
      logoSrc="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=256&h=256&fit=crop&crop=entropy"
      companyName="DEWIBE"
      description={lt(copy.description, locale)}
      usefulLinks={[
        { label: lt(copy.work, locale), href: "#work" },
        { label: lt(copy.services, locale), href: "#services" },
        { label: lt(copy.about, locale), href: "#about" },
        { label: lt(copy.contact, locale), href: "#contact" },
        { label: lt(copy.privacy, locale), href: "#privacy" },
      ]}
      usefulLinksTitle={lt(copy.usefulLinksTitle, locale)}
      followUsTitle={lt(copy.followUsTitle, locale)}
      newsletterTitle={lt(copy.newsletterTitle, locale)}
      socialLinks={socialLinksData}
      onSubscribe={handleNewsletterSubscribe}
      className="border-t border-border/40 bg-[#030305]"
    />
  );
}
