import type { ReactNode } from "react";
import { PAGE_PAD_Y_MM } from "../constants";
import { ResumePage } from "../ResumePage";
import { ContactIcon, DescriptionText, LevelDots } from "../parts";
import type { EntryView, PreparedResume } from "../prepare";

function Section({
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
        className={`mb-3 flex break-after-avoid items-center gap-2 text-[13px] font-bold ${data.headingClass}`}
        style={{ color: data.accent.main }}
      >
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full"
          style={{ background: data.accent.main }}
        />
        {title}
        <span
          aria-hidden="true"
          className="h-px flex-1"
          style={{ background: data.accent.light }}
        />
      </h2>
      {children}
    </section>
  );
}

function TimelineEntry({
  entry,
  data,
}: {
  entry: EntryView;
  data: PreparedResume;
}) {
  return (
    <article className="relative break-inside-avoid border-s-2 ps-4" style={{ borderColor: data.accent.light }}>
      <span
        aria-hidden="true"
        className="absolute top-1.5 -start-[7px] size-3 rounded-full border-2 border-white"
        style={{ background: data.accent.main }}
      />
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-semibold text-slate-900">{entry.title}</h3>
        {entry.period ? (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: data.accent.light, color: data.accent.dark }}
          >
            <bdi>{entry.period}</bdi>
          </span>
        ) : null}
      </div>
      {entry.subtitle || entry.location ? (
        <p className="text-[12px] text-slate-600">
          {entry.subtitle}
          {entry.subtitle && entry.location ? " · " : null}
          {entry.location}
        </p>
      ) : null}
      <DescriptionText text={entry.description} className="mt-1 text-slate-800" />
    </article>
  );
}

export function CreativeTemplate({ data }: { data: PreparedResume }) {
  const { labels, accent } = data;

  return (
    <ResumePage dir={data.dir} lang={data.lang} fontClass={data.fontClass}>
      <div className="text-[13px] leading-[1.5] text-slate-900">
        {/* The band pulls up over the top margin row so it touches the page edge. */}
        <header
          className="flex items-center gap-6 px-[16mm] pb-7 text-white"
          style={{
            background: accent.main,
            marginTop: `-${PAGE_PAD_Y_MM}mm`,
            paddingTop: `${PAGE_PAD_Y_MM + 8}mm`,
            borderBottomLeftRadius: "10mm",
            borderBottomRightRadius: "10mm",
          }}
        >
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo}
              alt=""
              className="size-[32mm] shrink-0 rounded-full border-4 border-white object-cover"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            {data.name ? (
              <h1 className="text-[32px] font-extrabold leading-tight">{data.name}</h1>
            ) : null}
            {data.jobTitle ? (
              <p className="mt-1 text-[16px] text-white/90">{data.jobTitle}</p>
            ) : null}
            {data.contacts.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/95">
                {data.contacts.map((c) => (
                  <li key={c.kind} className="flex items-center gap-1.5">
                    <ContactIcon kind={c.kind} className="size-3.5 shrink-0" />
                    <bdi>{c.text}</bdi>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        <div className="px-[16mm] pb-4">
          {data.summary ? (
            <Section title={labels.sections.summary} data={data}>
              <p className="whitespace-pre-line text-slate-800">{data.summary}</p>
            </Section>
          ) : null}

          {data.experience.length > 0 ? (
            <Section title={labels.sections.experience} data={data}>
              <div className="space-y-4">
                {data.experience.map((e) => (
                  <TimelineEntry key={e.id} entry={e} data={data} />
                ))}
              </div>
            </Section>
          ) : null}

          {data.education.length > 0 ? (
            <Section title={labels.sections.education} data={data}>
              <div className="space-y-4">
                {data.education.map((e) => (
                  <TimelineEntry key={e.id} entry={e} data={data} />
                ))}
              </div>
            </Section>
          ) : null}

          {data.skills.length > 0 || data.languages.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-8">
              {data.skills.length > 0 ? (
                <Section title={labels.sections.skills} data={data}>
                  <ul className="flex flex-wrap gap-1.5">
                    {data.skills.map((skill, index) => (
                      <li
                        key={index}
                        className="rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                        style={{ background: accent.light, color: accent.dark }}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : (
                <div />
              )}
              {data.languages.length > 0 ? (
                <Section title={labels.sections.languages} data={data}>
                  <ul className="space-y-2">
                    {data.languages.map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-3 break-inside-avoid">
                        <span>
                          <span className="font-semibold">{l.name}</span>
                          <span className="block text-[11px] text-slate-600">{l.levelLabel}</span>
                        </span>
                        <LevelDots
                          level={l.levelIndex}
                          activeColor={accent.main}
                          idleColor={accent.light}
                        />
                      </li>
                    ))}
                  </ul>
                </Section>
              ) : (
                <div />
              )}
            </div>
          ) : null}

          {data.certifications.length > 0 ? (
            <Section title={labels.sections.certifications} data={data}>
              <ul className="space-y-1.5">
                {data.certifications.map((c) => (
                  <li key={c.id} className="flex justify-between gap-4 break-inside-avoid">
                    <span>
                      <span className="font-semibold">{c.name}</span>
                      {c.issuer ? <span className="text-slate-600"> — {c.issuer}</span> : null}
                    </span>
                    {c.date ? (
                      <span className="shrink-0 text-[12px] text-slate-600">
                        <bdi>{c.date}</bdi>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {data.projects.length > 0 ? (
            <Section title={labels.sections.projects} data={data}>
              <div className="space-y-3">
                {data.projects.map((pr) => (
                  <article key={pr.id} className="break-inside-avoid">
                    <h3 className="font-semibold">
                      {pr.name}
                      {pr.url ? (
                        <span className="font-normal" style={{ color: accent.main }}>
                          {" — "}
                          <a href={pr.href}>
                            <bdi>{pr.url}</bdi>
                          </a>
                        </span>
                      ) : null}
                    </h3>
                    <DescriptionText text={pr.description} className="mt-1 text-slate-800" />
                  </article>
                ))}
              </div>
            </Section>
          ) : null}

          {data.links.length > 0 ? (
            <Section title={labels.sections.links} data={data}>
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {data.links.map((l) => (
                  <li key={l.id}>
                    {l.label ? <span className="font-semibold">{l.label}: </span> : null}
                    <a href={l.href} style={{ color: accent.main }}>
                      <bdi>{l.text}</bdi>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      </div>
    </ResumePage>
  );
}
