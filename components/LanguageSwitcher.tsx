"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Globe } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { useLanguage, LOCALES } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/types";
import "@/components/BubbleMenu.css";
import "./LanguageSwitcher.css";

const MENU_BG = "rgba(20, 20, 25, 0.85)";
const MENU_COLOR = "#ffffff";

const LANG_ITEMS: {
  code: Locale;
  rotation: number;
  hoverStyles: { bgColor: string; textColor: string };
}[] = [
  {
    code: "en",
    rotation: -8,
    hoverStyles: { bgColor: "#8A63F8", textColor: "#ffffff" },
  },
  {
    code: "uz",
    rotation: 8,
    hoverStyles: { bgColor: "#5A8CFF", textColor: "#ffffff" },
  },
  {
    code: "ru",
    rotation: -8,
    hoverStyles: { bgColor: "#00FF88", textColor: "#030305" },
  },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleToggle = () => {
    const next = !isOpen;
    if (next) setShowOverlay(true);
    setIsOpen(next);
  };

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const isDesktop = window.innerWidth >= 900;
        const rotation = isDesktop ? LANG_ITEMS[i].rotation : 0;
        const delay = i * 0.12 + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        gsap.set(bubble, { scale: 0, rotation, transformOrigin: "50% 50%" });

        tl.to(bubble, {
          scale: 1,
          rotation,
          duration: 0.5,
          ease: "back.out(1.5)",
        });

        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            "-=0.45",
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isOpen, showOverlay]);

  useEffect(() => {
    const handleResize = () => {
      if (!isOpen) return;
      const bubbles = bubblesRef.current.filter(Boolean);
      const isDesktop = window.innerWidth >= 900;

      bubbles.forEach((bubble, i) => {
        const item = LANG_ITEMS[i];
        if (bubble && item) {
          const rotation = isDesktop ? item.rotation : 0;
          gsap.set(bubble, { rotation });
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`bubble nav-action-bubble language-globe-btn cursor-target${
          isOpen ? " open" : ""
        }`}
        onClick={handleToggle}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{ background: MENU_BG }}
      >
        <Globe size={22} weight="duotone" color={MENU_COLOR} />
      </button>

      {showOverlay && (
        <div
          ref={overlayRef}
          className="bubble-menu-items fixed bubble-menu-items-portfolio language-menu-overlay"
          aria-hidden={!isOpen}
          onClick={() => setIsOpen(false)}
        >
          <ul
            className="pill-list language-pill-list"
            role="menu"
            aria-label="Languages"
            onClick={(e) => e.stopPropagation()}
          >
            {LANG_ITEMS.map((item, idx) => {
              const localeMeta = LOCALES.find((l) => l.code === item.code);

              return (
                <li key={item.code} role="none" className="pill-col">
                  <button
                    type="button"
                    role="menuitem"
                    className={`pill-link language-pill-link cursor-target${
                      locale === item.code ? " is-active" : ""
                    }`}
                    style={
                      {
                        "--item-rot": `${item.rotation}deg`,
                        "--pill-bg": MENU_BG,
                        "--pill-color": MENU_COLOR,
                        "--hover-bg": item.hoverStyles.bgColor,
                        "--hover-color": item.hoverStyles.textColor,
                      } as CSSProperties
                    }
                    ref={(el) => {
                      bubblesRef.current[idx] = el;
                    }}
                    onClick={() => handleSelect(item.code)}
                    aria-pressed={locale === item.code}
                  >
                    <span
                      className="pill-label"
                      ref={(el) => {
                        labelRefs.current[idx] = el;
                      }}
                    >
                      {localeMeta?.menuLabel ?? item.code}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
