import { useRef, useState, type ReactNode } from 'react';
import AlgoSideBar from '@/components/AlgoSideBar';
import FloatingHelper, {
  type FloatingHelperProps,
} from '@/components/FloatingHelper';
import type { AlgoInfo } from '@/constants/algoInfo';

type AlgoBookShellProps = {
  children: ReactNode;
  algoInfo: AlgoInfo | null;
  helper?: Omit<
    FloatingHelperProps,
    'onToggleSidebar' | 'sidebarOpen' | 'boundsRef'
  >;
};

/** Side-by-side viz + algorithm reference panel (search, sort, …). */
const AlgoBookShell = ({ children, algoInfo, helper }: AlgoBookShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const vizRef = useRef<HTMLDivElement>(null);

  return (
    <div className="algo-book-shell flex h-screen w-full overflow-hidden bg-background">
      <div
        ref={vizRef}
        className="relative flex min-h-0 min-w-0 flex-1 flex-col"
      >
        {children}
        <FloatingHelper
          boundsRef={vizRef}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          sidebarOpen={sidebarOpen}
          {...helper}
        />
      </div>
      <AlgoSideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        algoInfo={algoInfo}
      />
    </div>
  );
};

export default AlgoBookShell;
