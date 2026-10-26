export const THUMBNAIL_VARIANTS = ["classic", "modern", "creative"] as const;
export type ThumbnailVariant = (typeof THUMBNAIL_VARIANTS)[number];

function Bar({
  w,
  h = "h-1",
  tone = "bg-slate-200",
}: {
  w: string;
  h?: string;
  tone?: string;
}) {
  return (
    <div className={`${h} shrink-0 rounded-full ${tone}`} style={{ width: w }} />
  );
}

function ClassicThumb() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="flex flex-col items-center gap-1.5">
        <Bar w="48%" h="h-2" tone="bg-slate-800" />
        <Bar w="30%" tone="bg-slate-400" />
      </div>
      <div className="h-px bg-slate-300" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Bar w="26%" h="h-1.5" tone="bg-slate-700" />
          <div className="h-px bg-slate-200" />
          <Bar w="100%" />
          <Bar w="92%" />
          <Bar w="70%" />
        </div>
      ))}
    </div>
  );
}

function ModernThumb() {
  return (
    <div className="flex h-full">
      <div className="flex w-[34%] flex-col gap-2 bg-brand-700 p-3">
        <div className="mx-auto size-9 rounded-full bg-white/80" />
        <Bar w="80%" tone="bg-white/50" />
        <Bar w="60%" tone="bg-white/30" />
        <div className="mt-2 flex flex-col gap-1.5">
          <Bar w="50%" tone="bg-white/70" />
          <Bar w="90%" tone="bg-white/30" />
          <Bar w="75%" tone="bg-white/30" />
          <Bar w="85%" tone="bg-white/30" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <Bar w="62%" h="h-2" tone="bg-slate-800" />
        <Bar w="38%" tone="bg-brand-600" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-1 flex flex-col gap-1.5">
            <Bar w="34%" h="h-1.5" tone="bg-brand-600" />
            <Bar w="100%" />
            <Bar w="88%" />
            <Bar w="64%" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CreativeThumb() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 rounded-b-2xl bg-slate-900 p-3">
        <div className="size-9 shrink-0 rounded-full bg-brand-400" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Bar w="70%" h="h-2" tone="bg-white" />
          <Bar w="45%" tone="bg-brand-300" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="flex flex-wrap gap-1">
          {["w-7", "w-9", "w-6", "w-8", "w-7"].map((w, i) => (
            <div
              key={i}
              className={`h-2.5 ${w} rounded-full ${
                i % 2 === 0 ? "bg-brand-200" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 border-s-2 border-brand-500 ps-2"
          >
            <Bar w="40%" h="h-1.5" tone="bg-slate-700" />
            <Bar w="100%" />
            <Bar w="76%" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TemplateThumbnail({ variant }: { variant: ThumbnailVariant }) {
  return (
    <div
      aria-hidden="true"
      className="aspect-[210/297] w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-md"
    >
      {variant === "classic" && <ClassicThumb />}
      {variant === "modern" && <ModernThumb />}
      {variant === "creative" && <CreativeThumb />}
    </div>
  );
}
