import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A small mint dot that trails the pointer. Native cursor stays visible.
 * Respects reduced-motion and coarse pointers.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 28, stiffness: 380, mass: 0.35 });
  const sy = useSpring(y, { damping: 28, stiffness: 380, mass: 0.35 });
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest?.(
        "a, button, input, textarea, select, [role='button'], [data-cursor]",
      );
      setHover(Boolean(el));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Soft glow halo */}
      <motion.div
        aria-hidden
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div
          className="rounded-full transition-all duration-200 ease-out"
          style={{
            width: hover ? 34 : 22,
            height: hover ? 34 : 22,
            background: "radial-gradient(circle, rgba(143,236,193,0.55) 0%, rgba(143,236,193,0) 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>
      {/* Crisp mint dot */}
      <motion.div
        aria-hidden
        style={{ translateX: x, translateY: y }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div
          className="rounded-full transition-all duration-150 ease-out"
          style={{
            width: hover ? 12 : 8,
            height: hover ? 12 : 8,
            background: "#2FB88A",
            boxShadow: "0 0 12px rgba(47,184,138,0.55)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>
    </>
  );
}
