"use client";

import { useState } from "react";
import type { Locale, LocalizedText, SiteCopy } from "@/lib/types";

type CopySection =
  | "hero"
  | "nav"
  | "work"
  | "services"
  | "clients"
  | "about"
  | "contact"
  | "footer";

const COPY_SECTIONS: { id: CopySection; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "nav", label: "Navigatsiya" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "clients", label: "Clients" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "footer", label: "Footer" },
];

interface CopyEditorProps {
  copy: SiteCopy;
  onChange: (copy: SiteCopy) => void;
  onSave: () => void;
  saving: boolean;
}

function updateLocalized(
  value: LocalizedText,
  locale: Locale,
  next: string,
): LocalizedText {
  return { ...value, [locale]: next };
}

function LocalizedField({
  label,
  value,
  locale,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedText;
  locale: Locale;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) {
  return (
    <div className="form-group full-width">
      <label className="form-label">{label}</label>
      {multiline ? (
        <textarea
          className="form-textarea"
          value={value[locale]}
          onChange={(e) => onChange(updateLocalized(value, locale, e.target.value))}
          rows={3}
        />
      ) : (
        <input
          className="form-input"
          value={value[locale]}
          onChange={(e) => onChange(updateLocalized(value, locale, e.target.value))}
        />
      )}
    </div>
  );
}

export default function CopyEditor({ copy, onChange, onSave, saving }: CopyEditorProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const [section, setSection] = useState<CopySection>("hero");

  const setCopy = (next: SiteCopy) => onChange(next);
  const activeSection = COPY_SECTIONS.find((item) => item.id === section);

  const renderSectionFields = () => {
    switch (section) {
      case "hero":
        return (
          <>
            <LocalizedField
              label="Sarlavha"
              value={copy.hero.title}
              locale={locale}
              onChange={(heroTitle) =>
                setCopy({ ...copy, hero: { ...copy.hero, title: heroTitle } })
              }
            />
            <LocalizedField
              label="Subtitr"
              value={copy.hero.subtitle}
              locale={locale}
              onChange={(heroSubtitle) =>
                setCopy({ ...copy, hero: { ...copy.hero, subtitle: heroSubtitle } })
              }
              multiline
            />
            <LocalizedField
              label="Asosiy tugma"
              value={copy.hero.ctaPrimary}
              locale={locale}
              onChange={(ctaPrimary) =>
                setCopy({ ...copy, hero: { ...copy.hero, ctaPrimary } })
              }
            />
            <LocalizedField
              label="Ikkinchi tugma"
              value={copy.hero.ctaSecondary}
              locale={locale}
              onChange={(ctaSecondary) =>
                setCopy({ ...copy, hero: { ...copy.hero, ctaSecondary } })
              }
            />
          </>
        );

      case "nav":
        return (
          <>
            {(["home", "work", "services", "about", "contact"] as const).map((key) => (
              <LocalizedField
                key={key}
                label={key}
                value={copy.nav[key]}
                locale={locale}
                onChange={(value) =>
                  setCopy({ ...copy, nav: { ...copy.nav, [key]: value } })
                }
              />
            ))}
          </>
        );

      case "work":
        return (
          <>
            <LocalizedField
              label="Label"
              value={copy.work.label}
              locale={locale}
              onChange={(label) => setCopy({ ...copy, work: { ...copy.work, label } })}
            />
            <LocalizedField
              label="Sarlavha"
              value={copy.work.title}
              locale={locale}
              onChange={(title) => setCopy({ ...copy, work: { ...copy.work, title } })}
            />
            <LocalizedField
              label="Tavsif"
              value={copy.work.description}
              locale={locale}
              onChange={(description) =>
                setCopy({ ...copy, work: { ...copy.work, description } })
              }
              multiline
            />
            <LocalizedField
              label="Loyiha linki"
              value={copy.work.viewProject}
              locale={locale}
              onChange={(viewProject) =>
                setCopy({ ...copy, work: { ...copy.work, viewProject } })
              }
            />
          </>
        );

      case "services":
        return (
          <>
            <LocalizedField
              label="Label"
              value={copy.services.label}
              locale={locale}
              onChange={(label) =>
                setCopy({ ...copy, services: { ...copy.services, label } })
              }
            />
            <LocalizedField
              label="Sarlavha"
              value={copy.services.title}
              locale={locale}
              onChange={(title) =>
                setCopy({ ...copy, services: { ...copy.services, title } })
              }
            />
            <LocalizedField
              label="Tavsif"
              value={copy.services.description}
              locale={locale}
              onChange={(description) =>
                setCopy({ ...copy, services: { ...copy.services, description } })
              }
              multiline
            />
            <LocalizedField
              label="CTA matn"
              value={copy.services.ctaText}
              locale={locale}
              onChange={(ctaText) =>
                setCopy({ ...copy, services: { ...copy.services, ctaText } })
              }
            />
            <LocalizedField
              label="CTA tugma"
              value={copy.services.ctaButton}
              locale={locale}
              onChange={(ctaButton) =>
                setCopy({ ...copy, services: { ...copy.services, ctaButton } })
              }
            />

            {copy.services.items.map((item, index) => (
              <div key={item.id} className="copy-service-item">
                <h4>Xizmat {index + 1}</h4>
                <LocalizedField
                  label="Nomi"
                  value={item.title}
                  locale={locale}
                  onChange={(title) => {
                    const items = [...copy.services.items];
                    items[index] = { ...item, title };
                    setCopy({ ...copy, services: { ...copy.services, items } });
                  }}
                />
                <LocalizedField
                  label="Tavsif"
                  value={item.description}
                  locale={locale}
                  onChange={(description) => {
                    const items = [...copy.services.items];
                    items[index] = { ...item, description };
                    setCopy({ ...copy, services: { ...copy.services, items } });
                  }}
                  multiline
                />
                <div className="form-group full-width">
                  <label className="form-label">Features (har qator — bitta)</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={item.features[locale].join("\n")}
                    onChange={(e) => {
                      const items = [...copy.services.items];
                      items[index] = {
                        ...item,
                        features: {
                          ...item.features,
                          [locale]: e.target.value
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean),
                        },
                      };
                      setCopy({ ...copy, services: { ...copy.services, items } });
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        );

      case "clients":
        return (
          <>
            <LocalizedField
              label="Badge"
              value={copy.clients.badge}
              locale={locale}
              onChange={(badge) =>
                setCopy({ ...copy, clients: { ...copy.clients, badge } })
              }
            />
            <LocalizedField
              label="Sarlavha"
              value={copy.clients.title}
              locale={locale}
              onChange={(title) =>
                setCopy({ ...copy, clients: { ...copy.clients, title } })
              }
            />
            <LocalizedField
              label="Tavsif"
              value={copy.clients.description}
              locale={locale}
              onChange={(description) =>
                setCopy({ ...copy, clients: { ...copy.clients, description } })
              }
              multiline
            />
            <LocalizedField
              label="Tugma"
              value={copy.clients.button}
              locale={locale}
              onChange={(button) =>
                setCopy({ ...copy, clients: { ...copy.clients, button } })
              }
            />
          </>
        );

      case "about":
        return (
          <>
            <LocalizedField
              label="Label"
              value={copy.about.label}
              locale={locale}
              onChange={(label) => setCopy({ ...copy, about: { ...copy.about, label } })}
            />
            <LocalizedField
              label="Sarlavha"
              value={copy.about.title}
              locale={locale}
              onChange={(title) => setCopy({ ...copy, about: { ...copy.about, title } })}
            />
            <LocalizedField
              label="Tavsif"
              value={copy.about.description}
              locale={locale}
              onChange={(description) =>
                setCopy({ ...copy, about: { ...copy.about, description } })
              }
              multiline
            />
            <LocalizedField
              label="CTA matn"
              value={copy.about.ctaText}
              locale={locale}
              onChange={(ctaText) =>
                setCopy({ ...copy, about: { ...copy.about, ctaText } })
              }
            />
            <LocalizedField
              label="CTA tugma"
              value={copy.about.ctaButton}
              locale={locale}
              onChange={(ctaButton) =>
                setCopy({ ...copy, about: { ...copy.about, ctaButton } })
              }
            />
          </>
        );

      case "contact":
        return (
          <>
            {(
              [
                ["label", "Label"],
                ["title", "Sarlavha"],
                ["description", "Tavsif"],
                ["emailLabel", "Email label"],
                ["phoneLabel", "Phone label"],
                ["locationLabel", "Location label"],
                ["locationValue", "Location value"],
                ["availabilityTitle", "Availability title"],
                ["availabilitySubtitle", "Availability subtitle"],
                ["nameLabel", "Name label"],
                ["emailFieldLabel", "Email field label"],
                ["messageLabel", "Message label"],
                ["namePlaceholder", "Name placeholder"],
                ["emailPlaceholder", "Email placeholder"],
                ["messagePlaceholder", "Message placeholder"],
                ["submitButton", "Submit button"],
                ["submittingButton", "Submitting button"],
                ["successMessage", "Success message"],
                ["errorMessage", "Error message"],
              ] as const
            ).map(([key, label]) => (
              <LocalizedField
                key={key}
                label={label}
                value={copy.contact[key]}
                locale={locale}
                onChange={(value) =>
                  setCopy({ ...copy, contact: { ...copy.contact, [key]: value } })
                }
                multiline={key === "description" || key.includes("Message")}
              />
            ))}
          </>
        );

      case "footer":
        return (
          <>
            {(
              [
                ["description", "Tavsif"],
                ["usefulLinksTitle", "Useful links title"],
                ["followUsTitle", "Follow us title"],
                ["newsletterTitle", "Newsletter title"],
                ["work", "Work link"],
                ["services", "Services link"],
                ["about", "About link"],
                ["contact", "Contact link"],
                ["privacy", "Privacy link"],
              ] as const
            ).map(([key, label]) => (
              <LocalizedField
                key={key}
                label={label}
                value={copy.footer[key]}
                locale={locale}
                onChange={(value) =>
                  setCopy({ ...copy, footer: { ...copy.footer, [key]: value } })
                }
                multiline={key === "description"}
              />
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="copy-editor">
      <header className="copy-editor-header glass-card">
        <div className="copy-editor-header-top">
          <div>
            <h2 className="copy-editor-title">Matnlar</h2>
            <p className="copy-editor-meta">
              {activeSection?.label} · {locale.toUpperCase()}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>

        <div className="copy-editor-header-bottom">
          <div className="copy-section-tabs">
            {COPY_SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`copy-section-tab${section === item.id ? " active" : ""}`}
                onClick={() => setSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="copy-editor-lang">
            <span className="copy-lang-label">Til</span>
            <div className="copy-locale-tabs">
              {(["en", "uz", "ru"] as Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`copy-locale-tab${locale === code ? " active" : ""}`}
                  onClick={() => setLocale(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="copy-editor-section glass-card">
        {renderSectionFields()}
      </section>
    </div>
  );
}
