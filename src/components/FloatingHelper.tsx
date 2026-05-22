import { useState, useEffect, useRef, type RefObject } from 'react';
import { EyeIcon, XIcon, BookOpenIcon } from 'lucide-react';
import gsap from '../gsapSetup';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export interface FloatingHelperProps {
  text?: string;
  textId?: string;
  defaultVisible?: boolean;
  nextExploring?: number[];
  pathFollowed?: number[];
  algo?: string;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  /** When set, helper is positioned inside this container (avoids sidebar overlap). */
  boundsRef?: RefObject<HTMLElement | null>;
}

const FloatingHelper = ({
  text = ' ',
  textId = 'helper-text',
  defaultVisible = true,
  nextExploring,
  pathFollowed,
  algo,
  onToggleSidebar,
  sidebarOpen = false,
  boundsRef,
}: FloatingHelperProps) => {
  const [visible, setVisible] = useState(defaultVisible);
  const helperRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | undefined>(undefined);

  const anchored = Boolean(boundsRef);
  const positionClass = anchored
    ? 'absolute top-3 left-3 z-30'
    : 'fixed top-[68px] right-3 z-50';

  useEffect(() => {
    if (!visible || !helperRef.current) return;

    const bounds = boundsRef?.current ?? document.body;

    draggableRef.current = Draggable.create(helperRef.current, {
      type: 'x,y',
      bounds,
      zIndexBoost: false,
    });

    return () => {
      draggableRef.current?.forEach((d) => d.kill());
      draggableRef.current = undefined;
    };
  }, [visible, boundsRef]);

  const bookButton = onToggleSidebar && !sidebarOpen && (
    <button
      type="button"
      className="floating-helper-icon-btn"
      onClick={onToggleSidebar}
      title="Algorithm reference"
      aria-label="Open algorithm reference"
    >
      <BookOpenIcon className="h-4 w-4" />
    </button>
  );

  if (!visible) {
    return (
      <div className={`${positionClass} flex flex-col gap-2`}>
        <button
          type="button"
          className="floating-helper-icon-btn"
          onClick={() => setVisible(true)}
          title="Show helper"
          aria-label="Show helper"
        >
          <EyeIcon className="h-5 w-5 text-brand" />
        </button>
        {bookButton}
      </div>
    );
  }

  return (
    <div className={`${positionClass} flex flex-col items-start gap-2`}>
      {bookButton}
      <div
        ref={helperRef}
        className="floating-helper-card w-[min(100%,320px)] cursor-move sm:max-w-[340px]"
        style={{ touchAction: 'none', opacity: text === ' ' ? 0 : 1 }}
      >
        <div className="floating-helper-panel">
          <div className="flex w-full items-start justify-between gap-3">
            <p
              id={textId}
              className="font-plex text-sm font-medium leading-relaxed text-foreground"
            >
              {text}
            </p>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="floating-helper-close"
              aria-label="Hide helper"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          {nextExploring && nextExploring.length > 0 && (
            <div className="floating-helper-section">
              <p className="floating-helper-section-title">
                Next exploring {algo === 'DFS' ? '(stack)' : '(queue)'}
              </p>
              <div
                className={`flex max-h-36 flex-wrap gap-2 overflow-auto pr-1 ${algo === 'DFS' ? 'flex-col-reverse' : 'flex-row'}`}
              >
                {nextExploring.map((node, idx) => (
                  <span
                    key={`exploring-${node}-${idx}`}
                    className="floating-helper-chip floating-helper-chip--warn"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pathFollowed && pathFollowed.length > 0 && (
            <div className="floating-helper-section">
              <p className="floating-helper-section-title">Path followed</p>
              <div className="flex max-h-36 flex-row flex-wrap gap-2 overflow-auto pr-1">
                {pathFollowed.map((node, idx) => (
                  <span
                    key={`path-${node}-${idx}`}
                    className="floating-helper-chip floating-helper-chip--info"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingHelper;
