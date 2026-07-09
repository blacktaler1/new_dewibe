import {
  InstagramLogo,
  LinkedinLogo,
  TelegramLogo,
} from "@phosphor-icons/react/dist/ssr";
import { lt } from "@/lib/i18n";
import type { Locale, SiteCopy, TeamMember } from "@/lib/types";
import SectionHeader from "./SectionHeader";

function TeamMemberCard({
  member,
  locale,
}: {
  member: TeamMember;
  locale: Locale;
}) {
  const { firstName, lastName, role, image, social } = member;

  return (
    <article className="member-card">
      <div className="member-photo-wrap">
        <img
          src={image}
          alt={`${firstName} ${lastName}`}
          className="member-photo"
          loading="lazy"
        />
      </div>

      <div className="member-body">
        <h4 className="member-name">
          {firstName} {lastName}
        </h4>
        <p className="member-role">{lt(role, locale)}</p>

        <div className="member-divider" aria-hidden="true" />

        <div className="member-socials">
          {social.instagram && (
            <a
              href={social.instagram}
              className="member-social-link cursor-target"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${firstName} Instagram`}
            >
              <InstagramLogo weight="fill" />
            </a>
          )}
          {social.linkedin && (
            <a
              href={social.linkedin}
              className="member-social-link cursor-target"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${firstName} LinkedIn`}
            >
              <LinkedinLogo weight="fill" />
            </a>
          )}
          {social.telegram && (
            <a
              href={social.telegram}
              className="member-social-link cursor-target"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${firstName} Telegram`}
            >
              <TelegramLogo weight="fill" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

interface AboutSectionProps {
  team: TeamMember[];
  copy: SiteCopy["about"];
  locale: Locale;
}

export default function AboutSection({ team, copy, locale }: AboutSectionProps) {
  return (
    <section id="about" className="section">
      <div className="section-inner">
        <SectionHeader
          label={lt(copy.label, locale)}
          title={lt(copy.title, locale)}
          description={lt(copy.description, locale)}
        />

        <div className="team-grid">
          {team.map((member) => (
            <TeamMemberCard key={member.id} member={member} locale={locale} />
          ))}
        </div>

        <div className="about-cta">
          <p className="about-cta-text">{lt(copy.ctaText, locale)}</p>
          <a href="#contact" className="btn btn-primary cursor-target">
            {lt(copy.ctaButton, locale)}
          </a>
        </div>
      </div>
    </section>
  );
}
