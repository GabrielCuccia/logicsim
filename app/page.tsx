"use client"

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  NodeChange,
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Connection,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  ReactFlowInstance,
  OnSelectionChangeParams
} from "@xyflow/react";
import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import '@xyflow/react/dist/style.css';
import { SwitchNode, GateNode, LightNode, CustomEdge, AndGateNode, OrGateNode, NotGateNode, XorGateNode, PushButtonNode, ClockNode, DisplayNode } from "./components/CustomNodes";
import Sidebar from "./components/Sidebar";
import PropertiesSidebar from "./components/PropertiesSidebar";
import { useLogicEngine } from "./hooks/useLogicEngine";
import Header from "./components/Header";
const nodeTypes = {
  switch: SwitchNode,
  'push-button': PushButtonNode,
  clock: ClockNode,
  gate: GateNode, // Keep generic wrapper if needed
  'and-gate': AndGateNode,
  'or-gate': OrGateNode,
  'not-gate': NotGateNode,
  'xor-gate': XorGateNode,
  light: LightNode,
  display: DisplayNode,
};

const edgeTypes = {
  'custom-edge': CustomEdge,
};

const initialNodes: Node[] = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Switch 1', active: false }, type: 'switch' },
  { id: '2', position: { x: 50, y: 150 }, data: { label: 'Switch 2', active: true }, type: 'switch' },
  { id: '3', position: { x: 250, y: 100 }, data: { label: 'AND Gate' }, type: 'gate' },
  { id: '4', position: { x: 450, y: 100 }, data: { label: 'Light', active: false }, type: 'light' },
];
const initialEdges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', targetHandle: 'a', animated: true, type: 'custom-edge', style: { stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '5,5' } }, // Inactive (Gray)
  { id: 'e2-3', source: '2', target: '3', targetHandle: 'b', animated: true, type: 'custom-edge', style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' } }, // Active (Blue)
  { id: 'e3-4', source: '3', target: '4', animated: true, type: 'custom-edge', style: { stroke: '#9ca3af', strokeWidth: 2, strokeDasharray: '5,5' } },
];

// let id = 5;
const getId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const { runSimulation } = useLogicEngine();

  // Find the selected node
  const selectedNode = useMemo(() => nodes.find((node) => node.selected) || null, [nodes]);

  // Trigger simulation when nodes/edges change structure (connections), or simply use an effect.
  // We need to be careful not to create infinite loops.
  // runSimulation updates nodes/edges, so we can't just put it in useEffect([nodes, edges]).
  // We should run it manually on specific events OR use a debounce/ref check logic in the hook.
  // HOWEVER, our hook `runSimulation` does a check `if (changed)`.
  // To avoid loop: The runSimulation sets state ONLY if values change. 
  // If values match, it doesn't set state, so effect won't re-trigger. 
  // But strictly `useEffect([nodes, edges])` is dangerous.
  // Better approach: Run simulation on:
  // 1. Connection created/removed (onConnect, onDelete) (Handled by edges change?)
  // 2. Node added (onDrop) - though initially inactive.
  // 3. User Interaction (Toggle) - This is the main driver.

  // Let's rely on a manual trigger or a "Simulation Effect" that only runs when *topology* changes, 
  // and separate "State" changes. 
  // For now, let's try running it when *connections* change (edges) and when *inputs* are toggled.

  useEffect(() => {
    runSimulation(nodes, edges, setNodes, setEdges);
  }, [edges.length, edges.map(e => e.source + e.target).join(',')]); // Run when topology changes


  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string; }>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((edgesSnapshot) => {
        const newEdges = addEdge({ ...params, animated: true, type: 'custom-edge' }, edgesSnapshot);
        // Verify simulation after connection (needs state access? runSimulation handles it via effect or next render)
        return newEdges;
      });
    },
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node`, active: false },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  const onLabelChange = useCallback((id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label: newLabel } };
        }
        return node;
      })
    );
  }, []);

  const onDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);

  // Interaction Handler
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'switch' || node.type === 'push-button') {
      // Toggle State
      setNodes((nds) => {
        const newNodes = nds.map(n => {
          if (n.id === node.id) {
            return { ...n, data: { ...n.data, active: !n.data.active } };
          }
          return n;
        });

        // Immediate simulation trigger is tricky inside setState reducer.
        // We'll trust useEffect or call runSimulation here with new state.
        // Taking the simple route: update state -> waiting for render -> useEffect triggers? 
        // NO, useEffect above only listens to Edges topology.
        // We need to trigger simulation on STATE change of inputs.

        // We can manually call runSimulation with the NEW nodes and current edges.
        setTimeout(() => { // Small timeout to allow state to settle or just pass computed array
          runSimulation(newNodes, edges, setNodes, setEdges);
        }, 0);
        return newNodes;
      });
    }
  }, [edges, runSimulation]);




  // ... existing code ...

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header />
      <div className="flex flex-grow w-full h-full overflow-hidden">
        <Sidebar />
        <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background variant={BackgroundVariant.Lines} gap={24} size={1} color="#f0f0f0" className="bg-white" />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        <PropertiesSidebar
          selectedNode={selectedNode}
          onLabelChange={onLabelChange}
          onDelete={onDeleteNode}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
