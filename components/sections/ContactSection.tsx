"use client";

import { useState } from "react";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";
import { lt } from "@/lib/i18n";
import type { Locale, SiteCopy } from "@/lib/types";
import SectionHeader from "./SectionHeader";

interface ContactSectionProps {
  copy: SiteCopy["contact"];
  locale: Locale;
}

export default function ContactSection({ copy, locale }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setStatus("error");
        setIsSubmitting(false);
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }

    setIsSubmitting(false);
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id="contact" className="section section-alt">
      <div className="section-inner">
        <SectionHeader
          label={lt(copy.label, locale)}
          title={lt(copy.title, locale)}
          description={lt(copy.description, locale)}
        />

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-card glass-card cursor-target">
              <div className="contact-card-icon">
                <EnvelopeSimple size={20} weight="duotone" />
              </div>
              <div>
                <p className="contact-card-label">{lt(copy.emailLabel, locale)}</p>
                <p className="contact-card-value">
                  <a href="mailto:hello@dewibe.com">hello@dewibe.com</a>
                </p>
              </div>
            </div>

            <div className="contact-card glass-card cursor-target">
              <div className="contact-card-icon">
                <Phone size={20} weight="duotone" />
              </div>
              <div>
                <p className="contact-card-label">{lt(copy.phoneLabel, locale)}</p>
                <p className="contact-card-value">
                  <a href="tel:+998901234567">+998 90 123 45 67</a>
                </p>
              </div>
            </div>

            <div className="contact-card glass-card cursor-target">
              <div className="contact-card-icon">
                <MapPin size={20} weight="duotone" />
              </div>
              <div>
                <p className="contact-card-label">{lt(copy.locationLabel, locale)}</p>
                <p className="contact-card-value">{lt(copy.locationValue, locale)}</p>
              </div>
            </div>

            <div className="availability-card" style={{ maxWidth: "100%" }}>
              <div className="availability-status">
                <span className="pulse-dot" aria-hidden="true" />
                <span className="availability-title">
                  {lt(copy.availabilityTitle, locale)}
                </span>
              </div>
              <p className="availability-subtitle">
                {lt(copy.availabilitySubtitle, locale)}
              </p>
            </div>
          </div>

          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {lt(copy.nameLabel, locale)}
              </label>
              <input
                id="name"
                type="text"
                className="form-input cursor-target"
                placeholder={lt(copy.namePlaceholder, locale)}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {lt(copy.emailFieldLabel, locale)}
              </label>
              <input
                id="email"
                type="email"
                className="form-input cursor-target"
                placeholder={lt(copy.emailPlaceholder, locale)}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                {lt(copy.messageLabel, locale)}
              </label>
              <textarea
                id="message"
                className="form-textarea cursor-target"
                placeholder={lt(copy.messagePlaceholder, locale)}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              />
            </div>

            {status === "success" && (
              <p className="form-status success">
                {lt(copy.successMessage, locale)}
              </p>
            )}
            {status === "error" && (
              <p className="form-status error">
                {lt(copy.errorMessage, locale)}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary cursor-target"
              disabled={isSubmitting}
              style={{ width: "100%" }}
            >
              {isSubmitting
                ? lt(copy.submittingButton, locale)
                : lt(copy.submitButton, locale)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
