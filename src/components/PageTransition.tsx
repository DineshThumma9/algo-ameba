import { useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, filter: 'blur(8px)' },
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
      );
    },
    { dependencies: [location.pathname], scope: ref }
  );

  return (
    <div ref={ref} style={{ height: '100%' }}>
      {children}
    </div>
  );
}
