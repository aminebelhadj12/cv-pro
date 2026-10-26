export function SectionHeading({
  title,
  subtitle,
  tone = "dark",
}: {
  title: string;
  subtitle: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className={`text-2xl font-bold tracking-tight sm:text-3xl ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      <p className={`mt-3 text-base ${light ? "text-white" : "text-slate-600"}`}>
        {subtitle}
      </p>
    </div>
  );
}
