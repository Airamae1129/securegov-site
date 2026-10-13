interface LogoProps {
  variant?: "color" | "white";
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ variant = "color", withWordmark = true, className = "" }: LogoProps) {
  const stroke = variant === "white" ? "#FFFFFF" : "#4C1B8C";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} data-testid="sg-logo">
      <svg viewBox="0 0 100 100" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path
          d="M50 4 L88 19 V50 C88 74 72 88 50 96 C28 88 12 74 12 50 V19 Z"
          fill="none" stroke={stroke} strokeWidth="6" strokeLinejoin="round"
        />
        <g fill="none" stroke={stroke} strokeWidth="3.4">
          <circle cx="50" cy="52" r="23" />
          <ellipse cx="50" cy="52" rx="10.5" ry="23" />
          <path d="M28 44.5 H72 M28 59.5 H72" />
        </g>
        <g fill={stroke}>
          <rect x="41.5" y="52" width="17" height="15" rx="3" />
          <path d="M44.5 52 v-5 a5.5 5.5 0 0 1 11 0 v5 h-3.6 v-5 a1.9 1.9 0 0 0 -3.8 0 v5 Z" />
          <circle cx="50" cy="58.6" r="2.1" fill={variant === "white" ? "#220A43" : "#fff"} />
          <rect x="49.1" y="58.6" width="1.8" height="4.6" fill={variant === "white" ? "#220A43" : "#fff"} />
        </g>
      </svg>
      {withWordmark && (
        <span
          className={`font-heading text-lg font-extrabold tracking-[0.14em] ${
            variant === "white" ? "text-white" : "text-sg-primary"
          }`}
        >
          SECUREGOV
        </span>
      )}
    </span>
  );
}
