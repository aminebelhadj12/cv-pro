import { Link2 } from "lucide-react";
import type { ReactNode } from "react";
import { ResumePage } from "../ResumePage";
import { ContactIcon, DescriptionText, LevelDots } from "../parts";
import type { EntryView, PreparedResume } from "../prepare";

const SIDEBAR_PERCENT = 33;

function SideSection({
  title,
  data,
  children,
}: {
  title: string;
  data: PreparedResume;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2
        className={`mb-2 break-after-avoid border-b border-white/25 pb-1 text-[11px] font-bold ${data.headingClass}`}
        style={{ color: data.accent.light }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function MainSection({
  title,
  data,
  children,
}: {
  title: string;
  data: PreparedResume;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2
        className={`mb-3 break-after-avoid border-s-4 ps-3 text-[13px] font-bold ${data.headingClass}`}
        style={{ borderColor: data.accent.main, color: data.accent.dark }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({ entry, data }: { entry: EntryView; data: PreparedResume }) {
  return (
    <article className="break-inside-avoid">
      <h3 className="font-semibold text-slate-900">{entry.title}</h3>
      {entry.subtitle ? (
        <p className="font-medium" style={{ color: data.accent.main }}>
          {entry.subtitle}
        </p>
      ) : null}
      {entry.period || entry.location ? (
        <p className="text-[12px] text-slate-600">
          {entry.period ? <bdi>{entry.period}</bdi> : null}
          {entry.period && entry.location ? " · " : null}
          {entry.location}
        </p>
      ) : null}
      <DescriptionText text={entry.description} className="mt-1 text-slate-800" />
    </article>
  );
}

export function ModernTemplate({ data }: { data: PreparedResume }) {
  const { labels, accent } = data;
  const toward = data.dir === "rtl" ? "left" : "right";
  const background = `linear-gradient(to ${toward}, ${accent.dark} 0 ${SIDEBAR_PERCENT}%, #ffffff ${SIDEBAR_PERCENT}% 100%)`;

  return (
    <ResumePage
      dir={data.dir}
      lang={data.lang}
      fontClass={data.fontClass}
      background={background}
    >
      <div
        className="grid text-[13px] leading-[1.5]"
        style={{ gridTemplateColumns: `${SIDEBAR_PERCENT}% ${100 - SIDEBAR_PERCENT}%` }}
      >
        <aside className="min-w-0 px-[7mm] pb-6 text-white">
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo}
              alt=""
              className="mx-auto mb-2 mt-1 size-[34mm] rounded-full border-4 border-white/80 object-cover"
            />
          ) : null}

          {data.contacts.length > 0 ? (
            <SideSection title={labels.contact} data={data}>
              <ul className="space-y-2 text-[12px]">
                {data.contacts.map((c) => (
                  <li key={c.kind} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0" style={{ color: accent.light }}>
                      <ContactIcon kind={c.kind} />
                    </span>
                    <span className="min-w-0 break-words">
                      <bdi>{c.text}</bdi>
                    </span>
                  </li>
                ))}
              </ul>
            </SideSection>
          ) : null}

          {data.skills.length > 0 ? (
            <SideSection title={labels.sections.skills} data={data}>
              <ul className="space-y-1 text-[12px]">
                {data.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </SideSection>
          ) : null}

          {data.languages.length > 0 ? (
            <SideSection title={labels.sections.languages} data={data}>
              <ul className="space-y-2 text-[12px]">
                {data.languages.map((l) => (
                  <li key={l.id}>
                    <div className="font-semibold">{l.name}</div>
                    <div className="flex items-center justify-between gap-2 text-white/80">
                      <span>{l.levelLabel}</span>
                      <LevelDots
                        level={l.levelIndex}
                        activeColor="#ffffff"
                        idleColor="rgba(255,255,255,0.3)"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </SideSection>
          ) : null}

          {data.links.length > 0 ? (
            <SideSection title={labels.sections.links} data={data}>
              <ul className="space-y-2 text-[12px]">
                {data.links.map((l) => (
                  <li key={l.id} className="flex items-start gap-2">
                    <Link2
                      aria-hidden="true"
                      className="mt-0.5 size-3.5 shrink-0"
                      style={{ color: accent.light }}
                    />
                    <span className="min-w-0 break-words">
                      {l.label ? <span className="font-semibold">{l.label}: </span> : null}
                      <a href={l.href}>
                        <bdi>{l.text}</bdi>
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </SideSection>
          ) : null}
        </aside>

        <div className="min-w-0 px-[9mm] pb-6 text-slate-900">
          <header>
            {data.name ? (
              <h1 className="text-[28px] font-bold leading-tight" style={{ color: accent.dark }}>
                {data.name}
              </h1>
            ) : null}
            {data.jobTitle ? (
              <p className="mt-1 text-[15px] font-medium" style={{ color: accent.main }}>
                {data.jobTitle}
              </p>
            ) : null}
          </header>

          {data.summary ? (
            <MainSection title={labels.sections.summary} data={data}>
              <p className="whitespace-pre-line text-slate-800">{data.summary}</p>
            </MainSection>
          ) : null}

          {data.experience.length > 0 ? (
            <MainSection title={labels.sections.experience} data={data}>
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <Entry key={e.id} entry={e} data={data} />
                ))}
              </div>
            </MainSection>
          ) : null}

          {data.education.length > 0 ? (
            <MainSection title={labels.sections.education} data={data}>
              <div className="space-y-4">
                {data.education.map((e) => (
                  <Entry key={e.id} entry={e} data={data} />
                ))}
              </div>
            </MainSection>
          ) : null}

          {data.certifications.length > 0 ? (
            <MainSection title={labels.sections.certifications} data={data}>
              <ul className="space-y-2">
                {data.certifications.map((c) => (
                  <li key={c.id} className="break-inside-avoid">
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer ? <span className="text-slate-700"> — {c.issuer}</span> : null}
                    {c.date ? (
                      <span className="block text-[12px] text-slate-600">
                        <bdi>{c.date}</bdi>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </MainSection>
          ) : null}

          {data.projects.length > 0 ? (
            <MainSection title={labels.sections.projects} data={data}>
              <div className="space-y-3">
                {data.projects.map((pr) => (
                  <article key={pr.id} className="break-inside-avoid">
                    <h3 className="font-semibold">{pr.name}</h3>
                    {pr.url ? (
                      <p className="text-[12px]" style={{ color: accent.main }}>
                        <a href={pr.href}>
                          <bdi>{pr.url}</bdi>
                        </a>
                      </p>
                    ) : null}
                    <DescriptionText text={pr.description} className="mt-1 text-slate-800" />
                  </article>
                ))}
              </div>
            </MainSection>
          ) : null}
        </div>
      </div>
    </ResumePage>
  );
}
