import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useGSAP } from '@gsap/react';
import gsap from '../../gsapSetup';
import { toast } from 'sonner';
import FloatingHelper from '../FloatingHelper';
import ColorLegend, { TREE_GRAPH_LEGEND } from '../ColorLegend';
import algorithms from './graphConfig';
import {
  runBFS,
  runDFS,
  runDijstras,
  buildAdjList,
  runPrims,
  runKruskals,
} from './graphAlgorithms';
const EDGE_BASE_COLOR = '#64748b'; // slate-500: visible on light and dark backgrounds

// Resolve a CSS custom property value at call-time (respects current theme)
const getCSSVar = (varName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

const GraphPage = () => {
  // --- 1. State Management ---
  const [algo, setAlgo] = useState('BFS');

  // Separate states for different inputs
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [numNodes, setNumNodes] = useState<string>('');
  const [pathFollowed, setPathFollowed] = useState<number[]>([]);
  // Graph property states
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(true);

  const [nextExploring, setNextExploring] = useState<number[]>([]);
  const [phaseLabel, setPhaseLabel] = useState(' ');

  const graphRef = useRef<SVGSVGElement>(null);

  // Generate random graph
  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 5) + 3; // 3-7 nodes
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i + 1,
      label: String(i + 1),
    }));

    const links: { source: number; target: number; weight: number }[] = [];
    const edgeSet = new Set<string>();
    const maxEdges = Math.floor((nodeCount * (nodeCount - 1)) / 2);
    const edgeCount =
      Math.floor(Math.random() * (maxEdges - nodeCount + 1)) + nodeCount;

    for (let i = 0; i < edgeCount; i++) {
      const source = Math.floor(Math.random() * nodeCount) + 1;
      let target = Math.floor(Math.random() * nodeCount) + 1;
      while (target === source) {
        target = Math.floor(Math.random() * nodeCount) + 1;
      }
      const key = [Math.min(source, target), Math.max(source, target)].join(
        '-'
      );
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        links.push({
          source,
          target,
          weight: Math.floor(Math.random() * 10) + 1,
        });
      }
    }
    return { nodes, links };
  };

  const { contextSafe } = useGSAP({ scope: graphRef });

  const onRun = contextSafe(() => {
    const startNum = parseInt(startNode);
    if (isNaN(startNum) && algorithms[algo].startNode) {
      toast.error('Please enter a valid start node', {
        position: 'bottom-right',
        closeButton: true,
      });
      return;
    }

    console.log(`Parsed Num:${startNum}`);

    const adjList = buildAdjList(graphData.nodes, graphData.links, isDirected);

    console.log(`adj List:${adjList}`);

    let animationData;

    if (algo === 'BFS') {
      const targetNum = endNode ? parseInt(endNode) : undefined;

      animationData = runBFS(adjList, startNum, targetNum);
    }

    if (algo == 'DFS') {
      const targetNum = endNode ? parseInt(endNode) : undefined;
      animationData = runDFS(adjList, startNum, targetNum);
    }

    if (algo == "Prim's Algorithm") {
      animationData = runPrims(adjList, startNum);
    }
    if (algo == "Kruskal's Algorithm") {
      animationData = runKruskals(adjList);
    }

    if (algo == "Dijkstra's Algorithm") {
      const targetNum = endNode ? parseInt(endNode) : undefined;
      animationData = runDijstras(adjList, startNum, targetNum);
      const {
        animateNodes,
        animateEdges,
        shortestPathNodes,
        shortestPathEdges,
        exploringStates,
        pathStates,
      } = animationData as any;

      const tl = gsap.timeline();

      // 1. Reset everything to default colors
      tl.to('circle', {
        fill: getCSSVar('--node'),
        duration: 0.2,
        onStart: () => {
          setNextExploring([]);
          setPathFollowed([]);
          setPhaseLabel("Initializing Dijkstra\\'s algorithm...");
        },
      });
      tl.to(
        'line',
        { stroke: EDGE_BASE_COLOR, strokeWidth: 2, duration: 0.2 },
        '<'
      );

      // 2. Highlight Start Node
      tl.to(`#node-${animateNodes[0]}`, {
        fill: getCSSVar('--compare'),
        duration: 0.2,
        onStart: () => {
          if (exploringStates && exploringStates[0])
            setNextExploring(exploringStates[0]);
          if (pathStates && pathStates[0]) setPathFollowed(pathStates[0]);
          setPhaseLabel(`Starting at node ${animateNodes[0]}`);
        },
      });

      // 3. EXPLORATION PHASE
      for (let i = 0; i < animateEdges.length; i++) {
        const edge = animateEdges[i];
        const nextNode = animateNodes[i + 1];

        tl.to(
          `#edge-${edge.source}-${edge.target}, #edge-${edge.target}-${edge.source}`,
          {
            stroke: EDGE_BASE_COLOR,
            strokeWidth: 3,
            duration: 0.15,
          }
        );

        tl.to(`#node-${nextNode}`, {
          fill: getCSSVar('--node-visited'),
          duration: 0.15,
          ease: 'power1.inOut',
          onStart: () => {
            if (exploringStates && exploringStates[i + 1])
              setNextExploring(exploringStates[i + 1]);
            if (pathStates && pathStates[i + 1])
              setPathFollowed(pathStates[i + 1]);
            setPhaseLabel(`Relaxing edge to node ${nextNode}`);
          },
        });
      }

      // 4. SHORTEST PATH PHASE (DIJKSTRA ONLY)
      if (shortestPathEdges && shortestPathEdges.length > 0) {
        tl.to({}, { duration: 0.5 });

        for (let i = 0; i < shortestPathEdges.length; i++) {
          const edge = shortestPathEdges[i];
          const nextNode = shortestPathNodes[i + 1];

          tl.to(
            `#edge-${edge.source}-${edge.target}, #edge-${edge.target}-${edge.source}`,
            {
              stroke: getCSSVar('--node-active'),
              strokeWidth: 6,
              duration: 0.3,
            }
          );

          if (nextNode !== animateNodes[0]) {
            tl.to(
              `#node-${nextNode}`,
              {
                fill: getCSSVar('--node-active'),
                duration: 0.3,
                ease: 'back.out(1.5)',
                onStart: () => {
                  setPhaseLabel(`Constructing shortest path: node ${nextNode}`);
                },
              },
              '<'
            );
          }
        }
      }
    }

    console.log(`Animation data:${animationData}`);

    if (!animationData) {
      return;
    }

    const { animateNodes, animateEdges, exploringStates, pathStates } =
      animationData as any;

    const tl = gsap.timeline();

    tl.to('circle', {
      fill: getCSSVar('--node'),
      duration: 0.2,
      onStart: () => {
        setNextExploring([]);
        setPathFollowed([]);
        setPhaseLabel(`Initializing ${algo}...`);
      },
    });
    tl.to(
      'line',
      {
        stroke: EDGE_BASE_COLOR,
        strokeWidth: 2,
        duration: 0.2,
      },
      '<'
    );

    tl.to(`#node-${animateNodes[0]}`, {
      fill: getCSSVar('--compare'),
      duration: 0.2,
      onStart: () => {
        if (exploringStates && exploringStates[0])
          setNextExploring(exploringStates[0]);
        if (pathStates && pathStates[0]) setPathFollowed(pathStates[0]);
        setPhaseLabel(`Starting at node ${animateNodes[0]}`);
      },
    });

    for (let i = 0; i < animateEdges.length; i++) {
      const edge = animateEdges[i];
      const nextNode = animateNodes[i + 1];

      tl.to(
        `#edge-${edge.source}-${edge.target}, #edge-${edge.target}-${edge.source}`,
        {
          stroke: getCSSVar('--node-visited'),
          strokeWidth: 4,
          duration: 0.4,
        }
      );

      tl.to(`#node-${nextNode}`, {
        fill: getCSSVar('--node-visited'),
        duration: 0.4,
        ease: 'back.out(1.5)',
        onStart: () => {
          if (exploringStates && exploringStates[i + 1])
            setNextExploring(exploringStates[i + 1]);
          if (pathStates && pathStates[i + 1])
            setPathFollowed(pathStates[i + 1]);
          setPhaseLabel(`Exploring node ${nextNode}`);
        },
      });
    }
  });

  const [graphData, setGraphData] = useState(generateRandomGraph());

  // Keep D3 effects in sync with isDirected toggle
  useEffect(() => {
    if (!graphRef.current) return;

    const svg = d3.select(graphRef.current);
    const width = graphRef.current.clientWidth || 800;
    const height = graphRef.current.clientHeight || 600;

    svg.selectAll('*').remove();

    // Setup arrow markers for directed graphs
    if (isDirected) {
      svg
        .append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 28) // Adjust to sit on edge of node radius
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', EDGE_BASE_COLOR)
        .style('stroke', 'none');
    }

    const nodes = graphData.nodes.map((d) => ({ ...d }));
    const links = graphData.links.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(140)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr(
        'id',
        (d: any) => `edge-${d.source.id ?? d.source}-${d.target.id ?? d.target}`
      )
      .attr('stroke', EDGE_BASE_COLOR)
      .attr('stroke-width', (d: any) => Math.sqrt(d.weight || 1) * 1.5)
      .attr('marker-end', isDirected ? 'url(#arrowhead)' : ''); // Apply arrows

    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag<SVGGElement, any>()
          .on('start', (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event: any, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append('circle')
      .attr('id', (d: any) => `node-${d.id}`)
      .attr('r', 30)
      .attr('fill', getCSSVar('--node'))
      .attr('stroke', getCSSVar('--node-stroke'))
      .attr('stroke-width', 2);

    node
      .append('text')
      .text((d: any) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', getCSSVar('--text'))
      .attr('font-size', '22px')
      .attr('font-family', 'monospace');

    // Only render weights if the configuration allows it AND the toggle is on
    const edgeLabels = svg
      .append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .text((d: any) => (isWeighted ? d.weight : ''))
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', getCSSVar('--foreground'));

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      edgeLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 5);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, isDirected, isWeighted]); // Re-render when config toggles change

  const onRandom = () => {
    const parsedInput = parseInt(numNodes);
    const MAX_GRAPH_NODES = 10;

    if (!isNaN(parsedInput) && parsedInput > MAX_GRAPH_NODES) {
      toast.error(
        `Max ${MAX_GRAPH_NODES} nodes for Graph. Using ${MAX_GRAPH_NODES} instead.`,
        {
          position: 'bottom-right',
          closeButton: true,
        }
      );
      setGraphData(generateRandomGraph());
      return;
    }

    const nodeCount =
      !isNaN(parsedInput) && parsedInput > 1
        ? parsedInput
        : Math.floor(Math.random() * 5) + 3;

    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i + 1,
      label: `${i + 1}`,
    }));

    const newLinks: Array<{ source: number; target: number; weight: number }> =
      [];

    for (let i = 1; i < nodeCount; i++) {
      const targetNode = Math.floor(Math.random() * i);
      newLinks.push({
        source: i + 1,
        target: targetNode + 1,
        weight: isWeighted ? Math.floor(Math.random() * 20) + 1 : 1, // Default to 1 if unweighted
      });
    }

    const extraEdges = Math.floor(Math.random() * nodeCount);
    for (let i = 0; i < extraEdges; i++) {
      const source = Math.floor(Math.random() * nodeCount) + 1;
      let target = Math.floor(Math.random() * nodeCount) + 1;

      while (target === source) {
        target = Math.floor(Math.random() * nodeCount) + 1;
      }

      const edgeExists = newLinks.some(
        (l) =>
          (l.source === source && l.target === target) ||
          (!isDirected && l.source === target && l.target === source)
      );

      if (!edgeExists) {
        newLinks.push({
          source,
          target,
          weight: isWeighted ? Math.floor(Math.random() * 20) + 1 : 1,
        });
      }
    }

    setGraphData({ nodes: newNodes, links: newLinks });
  };

  const currentConfig = algorithms[algo];

  return (
    <div className="flex flex-col h-screen w-full shell">
      <div className="nav w-full flex flex-wrap justify-between items-center gap-3 py-3 px-4 sm:px-8 mt-2">
        {/* Dynamic Inputs */}
        <div className="left-section flex flex-wrap justify-start items-center gap-2">
          {currentConfig.startNode && (
            <input
              className="input w-[120px]"
              placeholder="Start Node"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
            />
          )}

          {currentConfig.endNode && (
            <input
              className="input w-[120px]"
              placeholder="End Node"
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
            />
          )}

          {(currentConfig.startNode || currentConfig.endNode) && (
            <button className="btn-primary">Enter</button>
          )}

          <div className="flex flex-wrap gap-1 ml-1">
            <input
              className="input max-w-[140px]"
              placeholder="No. of Nodes"
              value={numNodes}
              onChange={(e) => setNumNodes(e.target.value)}
            />
            <button onClick={onRandom} className="btn-neutral">
              Generate Random
            </button>
          </div>

          {/* Dynamic Property Toggles */}
          <div className="flex flex-wrap gap-2 ml-2">
            {currentConfig.allowedNodeTypes.includes('directed') && (
              <button
                className="btn-toggle"
                data-active={isDirected ? 'true' : undefined}
                onClick={() => setIsDirected(true)}
              >
                Directed
              </button>
            )}
            {currentConfig.allowedNodeTypes.includes('undirected') && (
              <button
                className="btn-toggle"
                data-active={!isDirected ? 'true' : undefined}
                onClick={() => setIsDirected(false)}
              >
                Undirected
              </button>
            )}
            {currentConfig.weighted && (
              <button
                className="btn-toggle"
                data-active={isWeighted ? 'true' : undefined}
                onClick={() => setIsWeighted(!isWeighted)}
              >
                {isWeighted ? 'Weighted' : 'Unweighted'}
              </button>
            )}
          </div>
        </div>

        {/* Algorithm Selector */}
        <div className="right-section flex justify-center items-center gap-4">
          <Select value={algo} onValueChange={setAlgo}>
            <SelectTrigger className="w-56 select-trigger">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="select-content">
              <SelectGroup>
                <SelectLabel>Graph Algorithm</SelectLabel>
                {Object.keys(algorithms).map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <div className="flex w-full h-full"> */}
          <button className="btn-success" onClick={onRun}>
            Run
          </button>
          {/* </div> */}
        </div>
      </div>

      <div className="flex-grow w-full flex justify-center items-center overflow-hidden">
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full relative">
          <svg ref={graphRef} className="w-full h-full min-h-[600px]"></svg>
        </div>
      </div>

      <FloatingHelper
        text={phaseLabel}
        nextExploring={nextExploring}
        pathFollowed={pathFollowed}
        algo={algo}
      />
      {/* Color legend */}
      <div className="color-legend-fixed fixed bottom-0 left-1/2 -translate-x-1/2 z-40 rounded-t-lg">
        <ColorLegend
          entries={TREE_GRAPH_LEGEND}
          className="px-4 py-1.5 rounded-t-lg"
        />
      </div>
    </div>
  );
};

export default GraphPage;
