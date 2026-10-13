import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let rx = -100, ry = -100, tx = -100, ty = -100;
    let raf = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
      const t = e.target as HTMLElement;
      ring.classList.toggle("is-active", !!t.closest("a,button,[role=button],input,select,textarea,label,[data-cursor]"));
    };
    const loop = () => {
      rx += (tx - rx) * 0.14; ry += (ty - ry) * 0.14;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="sg-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="sg-cursor-ring" aria-hidden="true" />
    </>
  );
}
