import { L } from "./i18n";
import { defaultCopy } from "./default-copy";
import type { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  copy: defaultCopy,
  team: [
    {
      id: "1",
      firstName: "Zafar",
      lastName: "Ibragimov",
      role: L("Founder & CEO", "Asoschisi va CEO", "Основатель и CEO"),
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      social: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        telegram: "https://t.me",
      },
    },
    {
      id: "2",
      firstName: "Dilnoza",
      lastName: "Rakhimova",
      role: L("Lead UI/UX Designer", "Bosh UI/UX dizayner", "Ведущий UI/UX дизайнер"),
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      social: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        telegram: "https://t.me",
      },
    },
    {
      id: "3",
      firstName: "Jasur",
      lastName: "Toshmatov",
      role: L("Senior Frontend Developer", "Katta frontend dasturchi", "Старший frontend-разработчик"),
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
      social: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        telegram: "https://t.me",
      },
    },
    {
      id: "4",
      firstName: "Madina",
      lastName: "Yusupova",
      role: L("Brand & Motion Designer", "Brend va motion dizayner", "Бренд и motion дизайнер"),
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      social: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        telegram: "https://t.me",
      },
    },
    {
      id: "5",
      firstName: "Aziz",
      lastName: "Nazarov",
      role: L("Backend Developer", "Backend dasturchi", "Backend-разработчик"),
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop",
      social: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        telegram: "https://t.me",
      },
    },
    {
      id: "6",
      firstName: "Nilufar",
      lastName: "Ergasheva",
      role: L("Product Strategist", "Mahsulot strategi", "Продуктовый стратег"),
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
      social: {
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        telegram: "https://t.me",
      },
    },
  ],
  projects: [
    {
      id: "p1",
      title: L("Nebula Finance", "Nebula Finance", "Nebula Finance"),
      description: L(
        "A fintech dashboard with real-time analytics, dark UI, and micro-interactions for institutional clients.",
        "Institutsional mijozlar uchun real vaqt analitikasi, qorong'u UI va mikro-interaksiyalar bilan fintech dashboard.",
        "Финтех-дашборд с аналитикой в реальном времени, тёмным UI и микроинтеракциями для институциональных клиентов.",
      ),
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      tags: ["UI/UX", "React", "Dashboard"],
      href: "#",
    },
    {
      id: "p2",
      title: L("Aura Studio", "Aura Studio", "Aura Studio"),
      description: L(
        "Brand identity and immersive landing page for a creative agency with WebGL-inspired visuals.",
        "Ijodiy agentlik uchun brend identifikatsiyasi va WebGL uslubidagi immersiv landing sahifa.",
        "Брендинг и иммерсивный лендинг для креативного агентства с WebGL-визуалами.",
      ),
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      tags: ["Branding", "Next.js", "Motion"],
      href: "#",
    },
    {
      id: "p3",
      title: L("Pulse Health", "Pulse Health", "Pulse Health"),
      description: L(
        "Mobile-first health tracking app with clean data visualization and accessibility-first design.",
        "Toza ma'lumot vizualizatsiyasi va accessibility-first dizayn bilan mobil sog'liq ilovasi.",
        "Мобильное приложение для здоровья с чистой визуализацией данных и доступным дизайном.",
      ),
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
      tags: ["Mobile", "Design System", "Figma"],
      href: "#",
    },
    {
      id: "p4",
      title: L("Vertex Commerce", "Vertex Commerce", "Vertex Commerce"),
      description: L(
        "E-commerce experience with 3D product previews and a streamlined checkout flow.",
        "3D mahsulot ko'rinishlari va soddalashtirilgan checkout oqimi bilan e-commerce tajriba.",
        "E-commerce с 3D-превью товаров и упрощённым процессом оформления заказа.",
      ),
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      tags: ["E-commerce", "Three.js", "Shopify"],
      href: "#",
    },
    {
      id: "p5",
      title: L("Echo Music", "Echo Music", "Echo Music"),
      description: L(
        "Streaming platform redesign focused on discovery, playlists, and artist storytelling.",
        "Kashfiyot, playlistlar va artist hikoyalari uchun qayta ishlangan streaming platforma.",
        "Редизайн стриминговой платформы с фокусом на открытие музыки, плейлисты и истории артистов.",
      ),
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
      tags: ["Product Design", "Prototyping"],
      href: "#",
    },
    {
      id: "p6",
      title: L("Lumen AI", "Lumen AI", "Lumen AI"),
      description: L(
        "AI-powered SaaS landing with animated hero, pricing tiers, and conversion-optimized CTAs.",
        "Animatsiyali hero, narx tariflari va konversiyaga yo'naltirilgan CTA bilan AI SaaS landing.",
        "SaaS-лендинг с AI, анимированным hero, тарифами и CTA, оптимизированными под конверсию.",
      ),
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
      tags: ["SaaS", "Landing Page", "GSAP"],
      href: "#",
    },
  ],
};
