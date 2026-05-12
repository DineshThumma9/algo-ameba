import { useState, useEffect, useRef } from 'react';
import { EyeIcon, XIcon } from 'lucide-react';
import gsap from '../gsapSetup';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface FloatingHelperProps {
  /** The text content to display. Defaults to "Waiting for input..." */
  text?: string;
  /** DOM id for the helper text element so pages can update it directly */
  textId?: string;
  /** Whether the helper is initially visible */
  defaultVisible?: boolean;
  nextExploring?: number[];
  pathFollowed?: number[];
  algo?: string;
}
const FloatingHelper = ({
  text = ' ',
  textId = 'helper-text',
  defaultVisible = true,
  nextExploring,
  pathFollowed,
  algo,
}: FloatingHelperProps) => {
  const [visible, setVisible] = useState(defaultVisible);
  const helperRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | undefined>(undefined);

  useEffect(() => {
    if (visible && helperRef.current) {
      draggableRef.current = Draggable.create(helperRef.current, {
        type: 'x,y',
        bounds: 'body',
        zIndexBoost: true,
      });
    }
    return () => {
      draggableRef.current?.forEach((d) => d.kill());
    };
  }, [visible]);

  if (!visible) {
    return (
      <button
        className="fixed top-[68px] right-3 z-50 flex items-center justify-center
          p-3 rounded-full
          bg-background/90 text-foreground backdrop-blur-md
          border-2 border-border/80 shadow-[0_0_15px_rgba(0,255,17,0.15)]
          hover:bg-muted hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,17,0.25)] transition-all duration-200"
        onClick={() => setVisible(true)}
        title="Show Helper"
      >
        <EyeIcon className="w-5 h-5 text-brand" />
      </button>
    );
  }

  return (
    <div
      ref={helperRef}
      className="fixed top-[68px] right-3 z-50 min-w-[320px] max-w-[360px] cursor-move"
      style={{ touchAction: 'none', opacity: text == ' ' ? 0 : 1 }}
    >
      <div
        className="flex flex-col items-start gap-4 px-6 py-5
        bg-background/95 backdrop-blur-xl rounded-3xl
        border-2 border-brand/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-brand/20"
      >
        <div className="flex items-start justify-between w-full gap-4">
          {/* Step text */}
          <p
            className="text-base leading-relaxed font-medium text-foreground"
            id={textId}
          >
            {text}
          </p>

          {/* Close */}
          <button
            onClick={() => setVisible(false)}
            className="shrink-0 p-1.5 -mr-2 -mt-1 rounded-full
              text-muted-foreground/60 hover:text-foreground
              hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {nextExploring && nextExploring.length > 0 && (
          <div className="w-full mt-2 border-t-2 border-border/60 pt-4">
            <h1 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">
              Next Exploring {algo === 'DFS' ? '(Stack)' : '(Queue)'}
            </h1>
            <div
              className={`flex ${algo === 'DFS' ? 'flex-col-reverse' : 'flex-row'} gap-2 max-h-[160px] overflow-auto flex-wrap pr-1`}
            >
              {nextExploring.map((node, idx) => (
                <div
                  key={`exploring-${node}-${idx}`}
                  className="flex justify-center items-center px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm rounded-full border border-red-500/30 shadow-sm"
                >
                  {node}
                </div>
              ))}
            </div>
          </div>
        )}

        {pathFollowed && pathFollowed.length > 0 && (
          <div className="w-full mt-2 border-t-2 border-border/60 pt-4">
            <h1 className="text-xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">
              Path Followed
            </h1>
            <div className="flex flex-row gap-2 max-h-[160px] overflow-auto flex-wrap pr-1">
              {pathFollowed.map((node, idx) => (
                <div
                  key={`path-${node}-${idx}`}
                  className="flex justify-center items-center px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-full border border-blue-500/30 shadow-sm"
                >
                  {node}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingHelper;
