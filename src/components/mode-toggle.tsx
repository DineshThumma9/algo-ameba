import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';
import gsap from '@/gsapSetup';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // Resolve the real active mode (handles 'system')
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const resolve = () => {
      if (theme === 'dark') setIsDark(true);
      else if (theme === 'light') setIsDark(false);
      else setIsDark(mq.matches);
    };
    resolve();
    mq.addEventListener('change', resolve);
    return () => mq.removeEventListener('change', resolve);
  }, [theme]);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const isAppearanceTransition =
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
      setTheme(isDark ? 'light' : 'dark');
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.style.setProperty('--theme-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-y', `${y}px`);
    document.documentElement.style.setProperty('--theme-radius', '0px');

    const transition = (document as any).startViewTransition(() => {
      setTheme(isDark ? 'light' : 'dark');
    });

    transition.ready.then(() => {
      gsap.to(document.documentElement, {
        '--theme-radius': `${endRadius}px`,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          document.documentElement.style.removeProperty('--theme-radius');
          document.documentElement.style.removeProperty('--theme-x');
          document.documentElement.style.removeProperty('--theme-y');
        },
      });
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
      data-dark={isDark ? 'true' : 'false'}
    >
      {/* Track */}
      <span className="theme-toggle__track" aria-hidden="true" />

      {/* Sliding thumb */}
      <span className="theme-toggle__thumb">
        <Sun
          className="theme-toggle__icon theme-toggle__icon--sun"
          aria-hidden="true"
        />
        <Moon
          className="theme-toggle__icon theme-toggle__icon--moon"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
