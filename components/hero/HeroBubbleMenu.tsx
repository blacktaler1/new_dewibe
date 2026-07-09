"use client";

import Link from "next/link";
import { CubeTransparent, SignIn } from "@phosphor-icons/react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BubbleMenu, { type MenuItem } from "@/components/BubbleMenu";
import { lt } from "@/lib/i18n";
import type { Locale, SiteCopy } from "@/lib/types";
import "@/components/LanguageSwitcher.css";

const MENU_BG = "rgba(20, 20, 25, 0.85)";
const MENU_COLOR = "#ffffff";

interface HeroBubbleMenuProps {
  nav: SiteCopy["nav"];
  locale: Locale;
}

export default function HeroBubbleMenu({ nav, locale }: HeroBubbleMenuProps) {
  const menuItems: MenuItem[] = [
    {
      label: lt(nav.home, locale),
      href: "#home",
      ariaLabel: lt(nav.home, locale),
      rotation: -8,
      hoverStyles: { bgColor: "#8A63F8", textColor: "#ffffff" },
    },
    {
      label: lt(nav.work, locale),
      href: "#work",
      ariaLabel: lt(nav.work, locale),
      rotation: 8,
      hoverStyles: { bgColor: "#5A8CFF", textColor: "#ffffff" },
    },
    {
      label: lt(nav.services, locale),
      href: "#services",
      ariaLabel: lt(nav.services, locale),
      rotation: -8,
      hoverStyles: { bgColor: "#FF6B9D", textColor: "#ffffff" },
    },
    {
      label: lt(nav.about, locale),
      href: "#about",
      ariaLabel: lt(nav.about, locale),
      rotation: -8,
      hoverStyles: { bgColor: "#00FF88", textColor: "#030305" },
    },
    {
      label: lt(nav.contact, locale),
      href: "#contact",
      ariaLabel: lt(nav.contact, locale),
      rotation: 8,
      hoverStyles: { bgColor: "#9C7AFA", textColor: "#ffffff" },
    },
  ];

  return (
    <BubbleMenu
      className="bubble-menu-portfolio"
      overlayClassName="bubble-menu-items-portfolio"
      logo={
        <Link
          href="/#home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            color: MENU_COLOR,
          }}
        >
          <CubeTransparent size={22} weight="duotone" color="#8A63F8" />
          DEWIBE
        </Link>
      }
      items={menuItems}
      menuAriaLabel="Toggle navigation"
      menuBg={MENU_BG}
      menuContentColor={MENU_COLOR}
      useFixedPosition={true}
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
      actions={
        <div className="nav-actions">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="bubble nav-action-bubble cursor-target"
            aria-label="Login"
            style={{ background: MENU_BG }}
          >
            <SignIn size={22} weight="bold" color={MENU_COLOR} />
          </Link>
        </div>
      }
    />
  );
}
