import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      data-testid="scroll-progress"
      aria-hidden="true"
      className="fixed top-0 left-0 z-[90] h-[3px] w-full origin-left sg-gradient-bg"
      style={{ transform: `scaleX(${p})` }}
    />
  );
}
