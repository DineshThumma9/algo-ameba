import { useState, useEffect, useRef, type RefObject } from 'react';
import { EyeIcon, XIcon, GripVerticalIcon } from 'lucide-react';
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
  /** When set, helper is positioned inside this container. */
  boundsRef?: RefObject<HTMLElement | null>;
}

const FloatingHelper = ({
  text = ' ',
  textId = 'helper-text',
  defaultVisible = true,
  nextExploring,
  pathFollowed,
  algo,
  boundsRef,
}: FloatingHelperProps) => {
  const [visible, setVisible] = useState(defaultVisible);
  const helperRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | undefined>(undefined);

  const anchored = Boolean(boundsRef);
  const isEmpty = !text || text.trim() === '';
  const positionClass = anchored
    ? 'absolute top-[80px] left-3 z-30'
    : 'fixed top-[80px] right-3 z-50';

  // Attach GSAP Draggable only to the drag-handle bar so the browser's native
  // resize grip (bottom-right corner) doesn't interfere with dragging.
  useEffect(() => {
    if (!visible || !helperRef.current || !dragHandleRef.current) return;
    const bounds = boundsRef?.current ?? document.body;
    draggableRef.current = Draggable.create(helperRef.current, {
      type: 'x,y',
      trigger: dragHandleRef.current, // drag only via the header strip
      bounds,
      zIndexBoost: false,
    });
    return () => {
      draggableRef.current?.forEach((d) => d.kill());
      draggableRef.current = undefined;
    };
  }, [visible, boundsRef]);

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
      </div>
    );
  }

  return (
    <div className={`${positionClass} flex flex-col items-start gap-2`}>
      {/*
       * Outer wrapper is what GSAP Draggable moves. It must have a fixed
       * initial size so that `resize: both` on the inner card works correctly
       * (the browser needs a concrete width to anchor the resize grip to).
       */}
      <div
        ref={helperRef}
        className="floating-helper-card"
        style={{
          touchAction: 'none',
          /* ── Resizable card ──────────────────────────────────────────
           * BOTH axes need an explicit size for `resize` to work.
           * Without a concrete height the browser can only resize width.
           * overflow:auto enables the native resize grip (◢ corner).
           * ─────────────────────────────────────────────────────────── */
          resize: 'both',
          overflow: 'hidden', // outer clips; inner scrolls
          width: 'min(100vw - 1.5rem, 320px)',
          height: '240px', // explicit → vertical resize works
          minWidth: '200px',
          maxWidth: '560px',
          minHeight: '120px',
          maxHeight: '80vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle — only this strip initiates GSAP drag */}
        <div
          ref={dragHandleRef}
          className="floating-helper-drag-handle flex w-full items-center justify-between gap-2 px-3 py-1.5 cursor-move select-none"
          style={{
            borderBottom:
              '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
            borderRadius: 'inherit',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            background: 'color-mix(in srgb, var(--panel-bg) 60%, transparent)',
          }}
        >
          <div className="flex items-center gap-1.5 opacity-60">
            <GripVerticalIcon
              className="h-3.5 w-3.5"
              style={{ color: 'var(--muted-text)' }}
            />
            <span
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--muted-text)' }}
            >
              Step log
            </span>
          </div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="floating-helper-close"
            aria-label="Hide helper"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Content area — takes remaining height, scrolls if content overflows */}
        <div
          className="floating-helper-panel"
          style={{
            borderTop: 'none',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <p
            id={textId}
            className={`font-plex text-sm font-medium leading-relaxed ${
              isEmpty ? 'italic' : 'text-foreground'
            }`}
            style={isEmpty ? { color: 'var(--muted-text)' } : undefined}
          >
            {isEmpty
              ? 'Run the algorithm to see step-by-step hints here.'
              : text}
          </p>

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
