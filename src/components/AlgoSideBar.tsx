import { useRef, useState, useEffect, useCallback } from 'react';
import { XIcon, GripVerticalIcon, ClipboardIcon, CheckIcon } from 'lucide-react';
import type { AlgoInfo } from '@/constants/algoInfo';

interface AlgoSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  algoInfo: AlgoInfo | null;
}

const LANG_LABELS: {
  key: keyof AlgoInfo['implementations'];
  label: string;
}[] = [
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'cpp', label: 'C++' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'golang', label: 'Go' },
];

const MIN_WIDTH = 320;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 380;

type MainTab = 'explanation' | 'implementation';

const AlgoSideBar = ({ isOpen, onClose, algoInfo }: AlgoSideBarProps) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [mainTab, setMainTab] = useState<MainTab>('explanation');
  const [langTab, setLangTab] =
    useState<keyof AlgoInfo['implementations']>('python');
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_WIDTH);

  const onHandleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartWidth.current = width;
      e.preventDefault();
    },
    [width]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      const next = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, dragStartWidth.current + delta)
      );
      setWidth(next);
    };
    const onUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleCopy = (lang: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedLang(lang);
      setTimeout(() => setCopiedLang(null), 2000);
    });
  };

  return (
    <aside
      className="algo-sidebar"
      style={{ width: isOpen ? width : 0 }}
      aria-hidden={!isOpen}
    >
      <div
        className="algo-sidebar-handle"
        onMouseDown={onHandleMouseDown}
        title="Drag to resize"
      >
        <GripVerticalIcon className="h-3 w-3 text-muted-foreground/50" />
      </div>

      <div className="algo-sidebar-inner">
        <header className="algo-sidebar-header">
          <div className="min-w-0 flex-1">
            <p className="algo-sidebar-eyebrow">
              {algoInfo?.category ?? 'Algorithm'}
            </p>
            <h2 className="algo-sidebar-title">{algoInfo?.name ?? '—'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="algo-sidebar-close"
            aria-label="Close algorithm panel"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </header>

        {algoInfo && (
          <div className="algo-sidebar-badges">
            <span className="algo-badge algo-badge--time">
              {algoInfo.complexity.time}
            </span>
            <span className="algo-badge algo-badge--space">
              {algoInfo.complexity.space}
            </span>
          </div>
        )}

        <div className="algo-sidebar-tabs">
          <div className="algo-sidebar-tablist" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'explanation'}
              className={`algo-tab-trigger ${mainTab === 'explanation' ? 'algo-tab-trigger--active' : ''}`}
              onClick={() => setMainTab('explanation')}
            >
              Explanation
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'implementation'}
              className={`algo-tab-trigger ${mainTab === 'implementation' ? 'algo-tab-trigger--active' : ''}`}
              onClick={() => setMainTab('implementation')}
            >
              Code
            </button>
          </div>

          {mainTab === 'explanation' && (
            <div className="algo-sidebar-panel algo-sidebar-scroll-wrap">
              <div className="algo-sidebar-scroll">
                {algoInfo ? (
                  <>
                    <p className="algo-sidebar-prose">{algoInfo.description}</p>
                    <div>
                      <p className="algo-sidebar-eyebrow mb-3">Steps</p>
                      <ol className="algo-sidebar-steps">
                        {algoInfo.steps.map((step, i) => (
                          <li key={i}>
                            <span className="algo-step-num">{i + 1}</span>
                            <span className="algo-step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                ) : (
                  <p className="algo-sidebar-empty">No info available.</p>
                )}
              </div>
            </div>
          )}

          {mainTab === 'implementation' && (
            <div className="algo-sidebar-panel algo-sidebar-scroll-wrap flex min-h-0 flex-col">
              {algoInfo ? (
                <>
                  <div className="algo-sidebar-tablist shrink-0" role="tablist">
                    {LANG_LABELS.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={langTab === key}
                        className={`algo-tab-trigger text-[11px] ${langTab === key ? 'algo-tab-trigger--active' : ''}`}
                        onClick={() => setLangTab(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="algo-sidebar-scroll relative flex-1 min-h-0">
                    <button
                      type="button"
                      className="algo-copy-btn"
                      onClick={() =>
                        handleCopy(langTab, algoInfo.implementations[langTab])
                      }
                      title="Copy code"
                    >
                      {copiedLang === langTab ? (
                        <CheckIcon className="h-3 w-3 text-brand" />
                      ) : (
                        <ClipboardIcon className="h-3 w-3" />
                      )}
                      <span>
                        {copiedLang === langTab
                          ? 'Copied'
                          : `Copy ${LANG_LABELS.find((l) => l.key === langTab)?.label}`}
                      </span>
                    </button>
                    <pre className="algo-code-block">
                      <code>{algoInfo.implementations[langTab]}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <p className="algo-sidebar-empty px-5 py-4">
                  No implementations available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AlgoSideBar;
