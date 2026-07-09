"use client";

import React, { useState, type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  logoSrc: string;
  companyName?: string;
  description?: string;
  usefulLinks?: { label: string; href: string }[];
  usefulLinksTitle?: string;
  followUsTitle?: string;
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  newsletterTitle?: string;
  onSubscribe?: (email: string) => Promise<boolean>;
}

export const Footer: FC<FooterProps> = ({
  logoSrc,
  companyName = "Datally Inc.",
  description = "Empowering businesses with intelligent financial solutions, designed for the future of finance.",
  usefulLinks = [
    { label: "Products", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
  usefulLinksTitle = "Useful Link",
  followUsTitle = "Follow Us",
  socialLinks = [],
  newsletterTitle = "Subscribe our newsletter",
  onSubscribe,
  className,
  ...props
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubscribe(email);

    setSubscriptionStatus(success ? "success" : "error");
    setIsSubmitting(false);

    if (success) {
      setEmail("");
    }

    setTimeout(() => {
      setSubscriptionStatus("idle");
    }, 3000);
  };

  return (
    <footer
      className={cn("bg-muted/50 text-foreground", className)}
      {...props}
    >
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt={`${companyName} Logo`}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold">{companyName}</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold">{usefulLinksTitle}</h3>
          <ul className="space-y-2">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="cursor-target text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:justify-self-center">
          <h3 className="mb-4 text-base font-semibold">{followUsTitle}</h3>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  className="cursor-target flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">{newsletterTitle}</h3>
          <form
            onSubmit={handleSubscribe}
            className="relative w-full max-w-sm"
          >
            <div className="relative">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus !== "idle"}
                required
                aria-label="Email for newsletter"
                className="pr-28"
              />
              <Button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== "idle"}
                className="cursor-target absolute right-0 top-0 h-full rounded-l-none px-4"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            {(subscriptionStatus === "success" ||
              subscriptionStatus === "error") && (
              <div
                key={subscriptionStatus}
                className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 text-center backdrop-blur-sm"
              >
                {subscriptionStatus === "success" ? (
                  <span className="font-semibold text-green-500">
                    Subscribed! 🎉
                  </span>
                ) : (
                  <span className="font-semibold text-destructive">
                    Failed. Try again.
                  </span>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};
