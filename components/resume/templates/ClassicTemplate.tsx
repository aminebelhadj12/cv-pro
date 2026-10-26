import { ResumePage } from "../ResumePage";
import { DescriptionText } from "../parts";
import type { EntryView, PreparedResume } from "../prepare";

function Section({
  title,
  data,
  children,
}: {
  title: string;
  data: PreparedResume;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2
        className={`mb-2 break-after-avoid border-b border-slate-300 pb-1 text-[12px] font-bold ${data.headingClass}`}
        style={{ color: data.accent.main }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({ entry }: { entry: EntryView }) {
  return (
    <article className="break-inside-avoid">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-semibold">
          {entry.title}
          {entry.subtitle ? (
            <span className="font-normal text-slate-700">
              {" — "}
              {entry.subtitle}
            </span>
          ) : null}
        </h3>
        {entry.period ? (
          <span className="shrink-0 text-[12px] text-slate-600">
            <bdi>{entry.period}</bdi>
          </span>
        ) : null}
      </div>
      {entry.location ? (
        <p className="text-[12px] text-slate-600">{entry.location}</p>
      ) : null}
      <DescriptionText text={entry.description} className="mt-1 text-slate-800" />
    </article>
  );
}

export function ClassicTemplate({ data }: { data: PreparedResume }) {
  const { labels } = data;

  return (
    <ResumePage dir={data.dir} lang={data.lang} fontClass={data.fontClass}>
      <div className="px-[16mm] text-[13px] leading-[1.5] text-slate-900">
        <header
          className="flex items-start justify-between gap-6 border-b-2 pb-4"
          style={{ borderColor: data.accent.main }}
        >
          <div className="min-w-0">
            {data.name ? (
              <h1 className="text-[30px] font-bold leading-tight">{data.name}</h1>
            ) : null}
            {data.jobTitle ? (
              <p className="mt-1 text-[16px]" style={{ color: data.accent.main }}>
                {data.jobTitle}
              </p>
            ) : null}
            {data.contacts.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-700">
                {data.contacts.map((c) => (
                  <li key={c.kind}>
                    <bdi>{c.text}</bdi>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo}
              alt=""
              className="size-[28mm] shrink-0 rounded-md object-cover"
            />
          ) : null}
        </header>

        {data.summary ? (
          <Section title={labels.sections.summary} data={data}>
            <p className="whitespace-pre-line text-slate-800">{data.summary}</p>
          </Section>
        ) : null}

        {data.experience.length > 0 ? (
          <Section title={labels.sections.experience} data={data}>
            <div className="space-y-3">
              {data.experience.map((e) => (
                <Entry key={e.id} entry={e} />
              ))}
            </div>
          </Section>
        ) : null}

        {data.education.length > 0 ? (
          <Section title={labels.sections.education} data={data}>
            <div className="space-y-3">
              {data.education.map((e) => (
                <Entry key={e.id} entry={e} />
              ))}
            </div>
          </Section>
        ) : null}

        {data.skills.length > 0 ? (
          <Section title={labels.sections.skills} data={data}>
            <p>{data.skills.join(" • ")}</p>
          </Section>
        ) : null}

        {data.languages.length > 0 ? (
          <Section title={labels.sections.languages} data={data}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {data.languages.map((l) => (
                <li key={l.id}>
                  <span className="font-semibold">{l.name}</span>
                  <span className="text-slate-700"> — {l.levelLabel}</span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {data.certifications.length > 0 ? (
          <Section title={labels.sections.certifications} data={data}>
            <ul className="space-y-1">
              {data.certifications.map((c) => (
                <li key={c.id} className="flex justify-between gap-4 break-inside-avoid">
                  <span>
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer ? (
                      <span className="text-slate-700"> — {c.issuer}</span>
                    ) : null}
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
                      <span className="font-normal text-slate-600">
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
            <ul className="space-y-0.5">
              {data.links.map((l) => (
                <li key={l.id}>
                  {l.label ? <span className="font-semibold">{l.label}: </span> : null}
                  <a href={l.href}>
                    <bdi>{l.text}</bdi>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </ResumePage>
  );
}
