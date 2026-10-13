import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Slim consent bar pinned to the very top. While it shows, its height is published as
// --sg-consent-h and the header slides down by that amount, so the bar never sits over
// page buttons or form fields — only over the strip that already scrolls under the header.
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem("sg-consent")) setShow(true);
    } catch {
      setShow(true);
    }
    const reset = () => setShow(true);
    window.addEventListener("sg-cookie-reset", reset);
    return () => window.removeEventListener("sg-cookie-reset", reset);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = barRef.current;
    if (!show || !el) {
      root.style.setProperty("--sg-consent-h", "0px");
      return;
    }
    const publish = () => root.style.setProperty("--sg-consent-h", `${el.offsetHeight}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, [show]);

  const answer = (v: string) => {
    try {
      localStorage.setItem("sg-consent", v);
    } catch {
      // storage blocked: just hide for this visit
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={barRef}
          data-testid="cookie-banner"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-[86] border-b border-sg-violet-400/20 bg-sg-ink-950/95 backdrop-blur-xl"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-4 py-2 md:px-8">
            <p className="text-[11px] leading-snug text-sg-body-dark sm:text-xs">
              <span className="font-semibold text-white">No tracking cookies.</span>{" "}
              <span className="sm:hidden">Analytics stay off until you accept.</span>
              <span className="hidden sm:inline">Privacy-friendly analytics stay off until you say yes.</span>
            </p>
            <div className="flex shrink-0 gap-1.5 sm:gap-2">
              <button data-testid="cookie-accept" onClick={() => answer("accepted")}
                className="rounded-md bg-sg-primary px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-sg-primary-600 sm:px-3 sm:text-xs">
                Accept
              </button>
              <button data-testid="cookie-decline" onClick={() => answer("declined")}
                className="rounded-md border border-sg-violet-400/40 px-2.5 py-1 text-[11px] font-semibold text-sg-body-dark transition-colors hover:border-sg-violet-400 hover:text-white sm:px-3 sm:text-xs">
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
