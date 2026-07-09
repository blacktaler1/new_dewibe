import { lt } from "@/lib/i18n";
import type { Locale, Project, SiteCopy } from "@/lib/types";
import SectionHeader from "./SectionHeader";

interface WorkSectionProps {
  projects: Project[];
  copy: SiteCopy["work"];
  locale: Locale;
}

export default function WorkSection({ projects, copy, locale }: WorkSectionProps) {
  return (
    <section id="work" className="section section-alt">
      <div className="section-inner">
        <SectionHeader
          label={lt(copy.label, locale)}
          title={lt(copy.title, locale)}
          description={lt(copy.description, locale)}
        />

        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.id} className="project-card glass-card">
              <div className="project-image-wrap">
                <img
                  src={project.image}
                  alt={lt(project.title, locale)}
                  className="project-image"
                  loading="lazy"
                />
                <div className="project-overlay" aria-hidden="true" />
              </div>
              <div className="project-body">
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="project-title">{lt(project.title, locale)}</h3>
                <p className="project-desc">{lt(project.description, locale)}</p>
                <a href={project.href} className="project-link cursor-target">
                  {lt(copy.viewProject, locale)}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
