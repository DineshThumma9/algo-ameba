import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from '@/gsapSetup';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps a page with a subtle GSAP enter animation.
 * On mount: fades in and lifts up from y:18 with power2.out.
 * Uses useGSAP so cleanup is automatic on unmount.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out' }
      );
    },
    { scope: ref }
  );

  // visibility:hidden prevents flash before GSAP runs
  return (
    <div ref={ref} style={{ visibility: 'hidden', height: '100%' }}>
      {children}
    </div>
  );
}
