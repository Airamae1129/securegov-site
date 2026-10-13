import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, sub, dark = false, align = "left" }: SectionHeadingProps) {
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`sg-eyebrow ${dark ? "text-sg-violet-400" : "text-sg-primary-600"}`}>{eyebrow}</p>
      <h2
        className={`mt-4 text-4xl font-extrabold leading-[1.06] sm:text-5xl ${
          dark ? "text-white" : "text-sg-text"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-5 text-base leading-relaxed md:text-lg ${dark ? "text-sg-body-dark" : "text-sg-muted"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}
