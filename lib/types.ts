export type Locale = "en" | "uz" | "ru";

export interface LocalizedText {
  en: string;
  uz: string;
  ru: string;
}

export type ServiceIcon =
  | "palette"
  | "code"
  | "sparkle"
  | "deviceMobile"
  | "stack"
  | "rocket";

export interface ServiceCopyItem {
  id: string;
  icon: ServiceIcon;
  title: LocalizedText;
  description: LocalizedText;
  features: Record<Locale, string[]>;
}

export interface SiteCopy {
  hero: {
    title: LocalizedText;
    subtitle: LocalizedText;
    ctaPrimary: LocalizedText;
    ctaSecondary: LocalizedText;
  };
  nav: {
    home: LocalizedText;
    work: LocalizedText;
    services: LocalizedText;
    about: LocalizedText;
    contact: LocalizedText;
  };
  work: {
    label: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    viewProject: LocalizedText;
  };
  services: {
    label: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    ctaText: LocalizedText;
    ctaButton: LocalizedText;
    items: ServiceCopyItem[];
  };
  clients: {
    badge: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    button: LocalizedText;
  };
  about: {
    label: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    ctaText: LocalizedText;
    ctaButton: LocalizedText;
  };
  contact: {
    label: LocalizedText;
    title: LocalizedText;
    description: LocalizedText;
    emailLabel: LocalizedText;
    phoneLabel: LocalizedText;
    locationLabel: LocalizedText;
    locationValue: LocalizedText;
    availabilityTitle: LocalizedText;
    availabilitySubtitle: LocalizedText;
    nameLabel: LocalizedText;
    emailFieldLabel: LocalizedText;
    messageLabel: LocalizedText;
    namePlaceholder: LocalizedText;
    emailPlaceholder: LocalizedText;
    messagePlaceholder: LocalizedText;
    submitButton: LocalizedText;
    submittingButton: LocalizedText;
    successMessage: LocalizedText;
    errorMessage: LocalizedText;
  };
  footer: {
    description: LocalizedText;
    usefulLinksTitle: LocalizedText;
    followUsTitle: LocalizedText;
    newsletterTitle: LocalizedText;
    work: LocalizedText;
    services: LocalizedText;
    about: LocalizedText;
    contact: LocalizedText;
    privacy: LocalizedText;
  };
}

export interface TeamMemberSocial {
  instagram?: string;
  linkedin?: string;
  telegram?: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: LocalizedText;
  image: string;
  social: TeamMemberSocial;
}

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  tags: string[];
  href: string;
}

export interface SiteContent {
  copy: SiteCopy;
  team: TeamMember[];
  projects: Project[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface DailyAnalytics {
  date: string;
  pageViews: number;
  leads: number;
}

export interface AnalyticsStats {
  totalPageViews: number;
  totalLeads: number;
  unreadLeads: number;
  conversionRate: number;
}

export interface AnalyticsSummary extends AnalyticsStats {
  daily: DailyAnalytics[];
  weeklyPageViews: { label: string; value: number }[];
  monthlyLeads: { label: string; value: number }[];
}
