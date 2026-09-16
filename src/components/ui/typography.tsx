import { Fragment, type ReactNode } from "react";

/**
 * A heading fragment: plain words, or words set in the quieter second tone.
 * Two tones of one typeface carry the emphasis: no second family is needed.
 */
export type Part = string | { tone: string };

const toWords = (parts: Part[]) =>
  parts.flatMap((p) => {
    const tone = typeof p !== "string";
    const text = typeof p === "string" ? p : p.tone;
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, tone }));
  });

/**
 * Words wrapped in clipping masks for the rise-in reveal. Real spaces sit
 * between the masks, so the text still wraps naturally and reads correctly to
 * assistive technology and in `textContent`.
 */
export const SplitText = ({ parts }: { parts: Part[] }) => {
  const words = toWords(parts);
  return (
    <>
      {words.map(({ word, tone }, i) => (
        <Fragment key={i}>
          <span className="split-mask">
            <span className={`split-word ${tone ? "tone-em" : ""}`}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
};

/** Words that brighten one after another as the paragraph is scrolled through. */
export const ScrubText = ({ text }: { text: string }) => {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="scrub-word">{word}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
};

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: Part[];
  lede?: ReactNode;
  className?: string;
}

/*
 * Every section opens the same way, on the same grid: a ruled line, the
 * clause number and label in the first three columns, the title across the
 * remaining nine. Consistency here is what lets each section's body be
 * different without the page falling apart.
 */
export const SectionHeader = ({ index, eyebrow, title, lede, className = "" }: SectionHeaderProps) => (
  <header className={`pb-14 md:pb-20 ${className}`}>
    <div data-rule aria-hidden="true" className="h-px w-full bg-foreground/15" />
    <div className="grid grid-cols-12 gap-x-6 gap-y-8 pt-5 md:pt-6">
      <p className="col-span-12 md:col-span-3 self-start flex items-center gap-3 md:pt-4">
        <span aria-hidden="true" className="label text-foreground">
          ({index})
        </span>
        <span className="label">{eyebrow}</span>
      </p>
      <div className="col-span-12 md:col-span-9">
        <h2 data-split className="display text-[clamp(2.75rem,7vw,6.5rem)] text-balance">
          <SplitText parts={title} />
        </h2>
        {lede && (
          <p
            data-reveal
            className="mt-6 md:mt-8 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            {lede}
          </p>
        )}
      </div>
    </div>
  </header>
);
