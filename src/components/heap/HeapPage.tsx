import { Select } from '@radix-ui/react-select';
import { Input } from '../ui/input';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useGSAP } from '@gsap/react';
import gsap from '../../gsapSetup';
import { toast } from 'sonner';
import { pushToHeap, popFromHeap, buildTreeFromArray } from './heapAlgorithms';
import { type HeapNode, type RenderNode, type RenderEdge } from './heapTypes';
import FloatingHelper from '../FloatingHelper';
import ColorLegend, { HEAP_LEGEND } from '../ColorLegend';

const HeapPage = () => {
  const MAX_HEAP_SIZE = 15;
  const [algo, setAlgo] = useState('Min-Heap');
  const [inputValue, setInputValue] = useState('');

  const [heap, setHeap] = useState<number[]>([]);

  const containerRef = useRef<SVGSVGElement>(null);

  const algorithms: string[] = ['Min-Heap', 'Max-Heap'];

  const heapRoot = useMemo(() => buildTreeFromArray(heap), [heap]);

  useEffect(() => {
    if (heap.length == 0) {
      onRandom();
    }
  }, [heap]);

  const { nodes, edges } = useMemo(() => {
    if (!heapRoot)
      return { nodes: [] as RenderNode[], edges: [] as RenderEdge[] };

    const hierarchyRoot = d3.hierarchy(heapRoot, (d) => {
      const children = [];
      if (d.left) children.push(d.left);
      if (d.right) children.push(d.right);
      return children.length > 0 ? children : null;
    });

    const treeLayout = d3.tree<HeapNode>().nodeSize([80, 100]);
    treeLayout(hierarchyRoot);

    const pathGenerator = d3
      .linkVertical<any, any>()
      .x((d) => d.x)
      .y((d) => d.y);

    const calculatedNodes: RenderNode[] = hierarchyRoot
      .descendants()
      .map((d) => ({
        id: d.data.id,
        val: d.data.val,
        x: d.x ?? 0,
        y: d.y ?? 0,
      }));

    const calculatedEdges: RenderEdge[] = hierarchyRoot.links().map((link) => ({
      id: `${link.source.data.index}-${link.target.data.index}`,
      d: pathGenerator(link) as string,
    }));

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [heapRoot]);

  const pendingAnimationRef = useRef<{
    type: 'push' | 'pop';
    animateNodes: { childIdx: number; parentIdx: number }[];
    newIndex?: number;
  } | null>(null);

  // Stores the final (post-swap) heap to commit after push animation finishes
  const finalHeapRef = useRef<number[] | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (nodes.length === 0) return;

      const pending = pendingAnimationRef.current;
      if (pending && pending.type === 'push') {
        playPendingAnimation(pending);
      } else if (!pending) {
        gsap.fromTo(
          '.edge',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power1.out' }
        );

        gsap.fromTo(
          '.node circle',
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.7)' }
        );
      }
    },
    { scope: containerRef, dependencies: [nodes, edges] }
  );

  const playPendingAnimation = (
    pending: typeof pendingAnimationRef.current,
    onComplete?: () => void
  ) => {
    if (!pending) {
      onComplete?.();
      return;
    }

    const heapTimeline = gsap.timeline({
      onComplete: () => {
        pendingAnimationRef.current = null;
        // After push animation, commit the final (post-swap) heap state
        if (pending.type === 'push' && finalHeapRef.current) {
          setHeap(finalHeapRef.current);
          finalHeapRef.current = null;
        }
        onComplete?.();
      },
    });

    heapTimeline.addLabel('reset');
    heapTimeline.to('.node circle', {
      fill: 'var(--node)',
      stroke: 'var(--node-stroke)',
      filter: 'none',
      scale: 1,
      duration: 0.5,
    });
    heapTimeline.to(
      '.edge',
      { stroke: 'var(--edge)', strokeWidth: 2, duration: 0.5 },
      '<'
    );

    if (
      pending.type === 'push' &&
      pending.animateNodes.length === 0 &&
      pending.newIndex !== undefined
    ) {
      heapTimeline.call(
        () => {
          const helperText = document.getElementById('helper-text');
          if (helperText) {
            helperText.textContent = `Inserted at correct position (No swaps needed).`;
          }
        },
        undefined,
        '<'
      );

      heapTimeline.addLabel('inserted');
      heapTimeline.to(
        `#node-${pending.newIndex}`,
        {
          fill: 'var(--node-visited)',
          scale: 1.12,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
        },
        '<'
      );
      heapTimeline.to(
        `#node-${pending.newIndex}`,
        { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 },
        '>'
      );
    } else {
      pending.animateNodes.forEach(({ childIdx, parentIdx }, i) => {
        heapTimeline.addLabel(`swap-${i}`);

        heapTimeline.call(
          () => {
            const helperText = document.getElementById('helper-text');
            if (helperText) {
              // FIXED: text-node-[index]
              const pVal = document.getElementById(
                `text-node-${parentIdx}`
              )?.textContent;
              const cVal = document.getElementById(
                `text-node-${childIdx}`
              )?.textContent;
              if (pVal && cVal) {
                helperText.textContent = `Node ${cVal} is ${algo === 'Max-Heap' ? 'Greater' : 'Smaller'} than Node ${pVal} | Swap`;
              } else {
                helperText.textContent = `Swapping Nodes...`;
              }
            }
          },
          undefined,
          '<'
        );

        // 1. Highlight both nodes being compared with a different color (e.g., Amber)
        heapTimeline.to(
          [`#node-${parentIdx}`, `#node-${childIdx}`],
          {
            fill: '#f59e0b',
            scale: 1.15,
            duration: 0.8,
            yoyo: true,
            repeat: 1,
          },
          '>'
        );

        // 2. Visually swap the text exactly at the peak of the animation
        heapTimeline.call(
          () => {
            // FIXED: text-node-[index]
            const parentText = document.getElementById(
              `text-node-${parentIdx}`
            );
            const childText = document.getElementById(`text-node-${childIdx}`);
            if (parentText && childText) {
              const temp = parentText.textContent;
              parentText.textContent = childText.textContent;
              childText.textContent = temp;
            }
          },
          undefined,
          '-=0.8'
        );

        // 3. Highlight the edge connecting them
        const minIdx = Math.min(parentIdx, childIdx);
        const maxIdx = Math.max(parentIdx, childIdx);
        heapTimeline.to(
          `#edge-${minIdx}-${maxIdx}`,
          { stroke: 'var(--node-visited)', strokeWidth: 4, duration: 0.3 },
          '-=0.8'
        );
      });
    }

    heapTimeline.addLabel('cleanup');
    heapTimeline.to(
      '.edge',
      { stroke: 'var(--edge)', strokeWidth: 2, duration: 0.8 },
      '>'
    );
    heapTimeline.to(
      '.node circle',
      {
        fill: 'var(--node)',
        stroke: 'var(--node-stroke)',
        strokeWidth: 2,
        filter: 'none',
        scale: 1,
        duration: 0.5,
        ease: 'power1.out',
      },
      '<'
    );
    heapTimeline.call(() => {
      const helperText = document.getElementById('helper-text');
      if (helperText) {
        helperText.textContent =
          pending.type === 'push' ? `Push complete.` : `Pop complete.`;
      }
    });
  };

  const onInsert = contextSafe((val: string) => {
    const values = val
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v) && val.trim() !== '');
    if (values.length === 0) {
      toast.error('Please enter valid numbers', {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }
    if (heap.length + values.length > MAX_HEAP_SIZE) {
      toast.error(`Heap is full! (max ${MAX_HEAP_SIZE} nodes)`, {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }

    if (values.length === 1) {
      const num = values[0];
      const { newHeap, preSwapHeap, animateNodes } = pushToHeap(
        heap,
        num,
        algo === 'Max-Heap'
      );

      const helperText = document.getElementById('helper-text');
      if (helperText) {
        helperText.textContent = `Pushing ${num} into Heap...`;
      }

      console.log(`🔺 ${algo} Heappush: Inserting [${num}]`);
      console.log(`  Before: [${heap.join(', ')}]`);

      if (animateNodes.length > 0) {
        const path = animateNodes
          .map(({ childIdx }) => newHeap[childIdx])
          .join(' ← ');
        console.log(`  Bubble path: ${num} ← ${path}`);
      } else {
        console.log(`  Inserted at end (no bubbling needed)`);
      }

      pendingAnimationRef.current = {
        type: 'push',
        animateNodes,
        newIndex: preSwapHeap.length - 1,
      };

      // Store the final heap; commit it after animation completes
      finalHeapRef.current = newHeap;

      // Render the pre-swap state so the animation can visually swap to the correct final state
      gsap.delayedCall(0.1, () => {
        setHeap(preSwapHeap);
      });

      setInputValue('');

      gsap.delayedCall(0.5 + animateNodes.length * 0.6, () => {
        console.log(`  After:  [${newHeap.join(', ')}]`);
      });
    } else {
      let currentHeap = [...heap];
      for (const num of values) {
        currentHeap = pushToHeap(currentHeap, num, algo === 'Max-Heap').newHeap;
      }
      setHeap(currentHeap);
      setInputValue('');
    }
  });

  const onDelete = contextSafe(() => {
    if (heap.length === 0) return;

    const rootValue = heap[0];
    const lastIdx = heap.length - 1;
    const { newHeap, animateNodes } = popFromHeap(heap, algo === 'Max-Heap');

    const helperText = document.getElementById('helper-text');
    if (helperText) {
      helperText.textContent = `Popping root (${rootValue})...`;
    }

    pendingAnimationRef.current = {
      type: 'pop',
      animateNodes,
    };

    const tl = gsap.timeline({
      onComplete: () => {
        const pending = pendingAnimationRef.current;
        playPendingAnimation(pending, () => {
          setHeap(newHeap);
        });
      },
    });

    if (heap.length === 1) {
      tl.to('#node-0', { scale: 0, opacity: 0, duration: 0.3 });
      return;
    }

    tl.to(
      '#node-0',
      {
        fill: '#ef4444',
        stroke: '#dc2626',
        strokeWidth: 4,
        filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.9))',
        scale: 1.15,
        duration: 0.5,
        ease: 'power2.out',
      },
      'start'
    ).to(
      `#node-${lastIdx}`,
      {
        fill: '#22c55e',
        stroke: '#16a34a',
        strokeWidth: 4,
        filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.9))',
        scale: 1.15,
        duration: 0.5,
        ease: 'power2.out',
      },
      'start'
    );

    // Step 2: Swap the root text, revert root color, and hide the last node
    // FIXED: text-node-[index]
    tl.to(
      `#text-node-0`,
      {
        textContent: String(heap[lastIdx]),
        duration: 0, // instantaneous text swap
      },
      '+=0.4'
    )
      .to(
        '#node-0',
        {
          fill: 'var(--node-visited)', // Set to visited color for the sift-down journey
          stroke: 'var(--node-stroke)',
          filter: 'none',
          scale: 1.1,
          duration: 0.6,
        },
        '<'
      )
      .to(
        [`#node-${lastIdx}`, `#text-node-${lastIdx}`],
        {
          // FIXED: text-node-[index]
          opacity: 0,
          duration: 0.6,
        },
        '<'
      );
  });

  const onRandom = () => {
    let currentHeap: number[] = [];
    const randomValues = new Set<number>();

    while (randomValues.size < 10) {
      randomValues.add(Math.floor(Math.random() * 100));
    }

    for (const val of randomValues) {
      currentHeap = pushToHeap(currentHeap, val, algo === 'Max-Heap').newHeap;
    }

    setHeap(currentHeap);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-audiowide">
      <div className="sticky w-full backdrop-blur z-10 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2">
          {/* ── Left: Input + action buttons ── */}
          <Input
            className="input w-[160px]"
            placeholder="Enter number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onInsert(inputValue)}
          />

          <button className="btn-primary" onClick={() => onInsert(inputValue)}>
            Heappush
          </button>
          <button className="btn-danger" onClick={onDelete}>
            Heappop
          </button>
          <button className="btn-neutral" onClick={onRandom}>
            Random
          </button>

          {/* ── Right: Algo select + Run (pushed to far end) ── */}
          <div className="flex items-center gap-2 ml-auto">
            <Select value={algo} onValueChange={setAlgo}>
              <SelectTrigger className="w-40 select-trigger">
                <SelectValue placeholder="Heap type" />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectGroup>
                  <SelectLabel>Heap Algorithm</SelectLabel>
                  {algorithms.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <button className="btn-success" onClick={onRandom}>
              Run
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-row justify-center items-start viz-canvas overflow-auto bg-background">
        <div className="flex flex-row tree-container justify-center items-start w-full min-h-full pt-5 relative">
          <svg
            ref={containerRef}
            className="tree canvas flex overflow-hidden justify-center items-start border-0  w-full h-full m-0 p-0 max-h-[800px]"
            width="100%"
            height="100%"
            viewBox="0 0 700 450"
            preserveAspectRatio="xMidYMin meet"
          >
            <g transform="translate(350, 60)">
              {edges.map((edge: RenderEdge) => (
                <path
                  className="edge"
                  key={edge.id}
                  d={edge.d}
                  id={`edge-${edge.id}`}
                  stroke="var(--edge)"
                  strokeWidth="2"
                  fill="none"
                />
              ))}

              {nodes.map((node: RenderNode) => (
                <g
                  key={`grp-${node.id}`}
                  className="node"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  <circle
                    id={node.id}
                    r={20}
                    fill="var(--node)"
                    stroke="var(--node-stroke)"
                    strokeWidth="2"
                  />
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    id={`text-${node.id}`}
                    fill="var(--text)"
                    fontSize="16px"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    {node.val}
                  </text>
                </g>
              ))}
            </g>
          </svg>

          <FloatingHelper />
          {/* Color legend */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 mb-0.5">
            <ColorLegend
              entries={HEAP_LEGEND}
              className="px-4 py-1.5 rounded-t-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapPage;
