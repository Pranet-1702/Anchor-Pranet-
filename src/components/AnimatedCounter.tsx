import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
  sublabel?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 1800,
  suffix = '',
  label,
  sublabel,
}) => {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const easeOutCubic = (t: number): number => --t * t * t + 1;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return (
    <div ref={elementRef} className="space-y-1">
      <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#fbf7ee] flex items-baseline">
        <span className="text-gold-gradient">{count}</span>
        {suffix && <span className="text-[#d4af37] ml-0.5">{suffix}</span>}
      </div>
      <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#fbf7ee]">
        {label}
      </div>
      {sublabel && (
        <div className="text-[11px] sm:text-xs text-[#8e94a8] font-light">
          {sublabel}
        </div>
      )}
    </div>
  );
};
