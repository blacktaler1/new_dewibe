"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { lt } from "@/lib/i18n";
import type { Locale, SiteCopy } from "@/lib/types";

interface ClientLogo {
  name: string;
  logo: string;
}

interface IntegrationHeroProps {
  copy: SiteCopy["clients"];
  locale: Locale;
}

const CLIENTS_ROW1: ClientLogo[] = [
  {
    name: "Nebula Finance",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968854.png",
  },
  {
    name: "Aura Studio",
    logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
  },
  {
    name: "Pulse Health",
    logo: "https://cdn-icons-png.flaticon.com/512/733/733609.png",
  },
  {
    name: "Vertex Commerce",
    logo: "https://cdn-icons-png.flaticon.com/512/732/732084.png",
  },
  {
    name: "Echo Music",
    logo: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
  },
  {
    name: "Lumen AI",
    logo: "https://cdn-icons-png.flaticon.com/512/281/281763.png",
  },
  {
    name: "PayFlow",
    logo: "https://cdn-icons-png.flaticon.com/512/888/888879.png",
  },
];

const CLIENTS_ROW2: ClientLogo[] = [
  {
    name: "CloudSync",
    logo: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  },
  {
    name: "DataVault",
    logo: "https://cdn-icons-png.flaticon.com/512/906/906324.png",
  },
  {
    name: "ShopWave",
    logo: "https://cdn-icons-png.flaticon.com/512/888/888841.png",
  },
  {
    name: "MediCore",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",
  },
  {
    name: "TaskHive",
    logo: "https://cdn-icons-png.flaticon.com/512/906/906361.png",
  },
  {
    name: "Brandly",
    logo: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
  },
  {
    name: "StreamKit",
    logo: "https://cdn-icons-png.flaticon.com/512/888/888847.png",
  },
];

const repeatClients = (clients: ClientLogo[], repeat = 4) =>
  Array.from({ length: repeat }).flatMap(() => clients);

export default function IntegrationHero({ copy, locale }: IntegrationHeroProps) {
  return (
    <section
      id="clients"
      className="relative overflow-hidden bg-[#030305] py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,99,248,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white backdrop-blur-sm">
          {lt(copy.badge, locale)}
        </span>

        <h2 className="text-3xl font-bold tracking-tight text-white lg:text-5xl">
          {lt(copy.title, locale)}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-lg text-[#d5d5d5]">
          {lt(copy.description, locale)}
        </p>

        <Button
          asChild
          className="mt-8 cursor-target rounded-lg bg-[#8A63F8] px-6 py-3 font-medium text-white hover:bg-[#9c7afa]"
        >
          <Link href="#work">{lt(copy.button, locale)}</Link>
        </Button>

        <div className="relative mt-14 overflow-hidden pb-2">
          <div className="flex animate-scroll-left gap-10 whitespace-nowrap">
            {repeatClients(CLIENTS_ROW1, 4).map((client, i) => (
              <div
                key={`row1-${client.name}-${i}`}
                className="group flex h-20 w-36 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 shadow-lg backdrop-blur-sm transition hover:border-[#8A63F8]/40 hover:bg-white/10"
                title={client.name}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span className="max-w-full truncate text-xs font-medium text-[#d5d5d5] group-hover:text-white">
                  {client.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex animate-scroll-right gap-10 whitespace-nowrap">
            {repeatClients(CLIENTS_ROW2, 4).map((client, i) => (
              <div
                key={`row2-${client.name}-${i}`}
                className="group flex h-20 w-36 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 shadow-lg backdrop-blur-sm transition hover:border-[#8A63F8]/40 hover:bg-white/10"
                title={client.name}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span className="max-w-full truncate text-xs font-medium text-[#d5d5d5] group-hover:text-white">
                  {client.name}
                </span>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#030305] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#030305] to-transparent" />
        </div>
      </div>
    </section>
  );
}
