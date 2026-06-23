import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export default function CountUp({ to, duration = 1.6 }) {
  const [value, setValue] = useState(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion || to === 0) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, duration, prefersReducedMotion]);

  return <>{value.toLocaleString()}</>;
}