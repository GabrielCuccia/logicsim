"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    Background,
    ReactFlowProvider,
    Node,
    Edge,
    useReactFlow,
    NodeChange,
    applyNodeChanges,
    Connection,
    addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; // Ensure styles are imported
import {
    SwitchNode,
    AndGateNode,
    LightNode,
    CustomEdge,
} from "../CustomNodes";
import { useLogicEngine } from "../../hooks/useLogicEngine"; // Adjust path if necessary

const nodeTypes = {
    switch: SwitchNode,
    "and-gate": AndGateNode,
    light: LightNode,
};

const edgeTypes = {
    "custom-edge": CustomEdge,
};

// Initial Nodes: 2 Switches, 1 AND Gate, 1 Light
const initialNodes: Node[] = [
    {
        id: "switch-1",
        type: "switch",
        position: { x: 50, y: 50 },
        data: { label: "Switch A", active: false },
    },
    {
        id: "switch-2",
        type: "switch",
        position: { x: 50, y: 150 },
        data: { label: "Switch B", active: false },
    },
    {
        id: "and-1",
        type: "and-gate",
        position: { x: 250, y: 100 },
        data: { label: "AND" },
    },
    {
        id: "light-1",
        type: "light",
        position: { x: 450, y: 115 }, // Centered relative to AND gate output roughly
        data: { label: "Light", active: false },
    },
];

// Initial Edges: Connect Switches to AND Gate, AND Gate to Light
const initialEdges: Edge[] = [
    {
        id: "e1",
        source: "switch-1",
        target: "and-1",
        targetHandle: "a", // Top input
        type: "custom-edge",
        animated: true,
    },
    {
        id: "e2",
        source: "switch-2",
        target: "and-1",
        targetHandle: "b", // Bottom input
        type: "custom-edge",
        animated: true,
    },
    {
        id: "e3",
        source: "and-1",
        sourceHandle: null, // Default source
        target: "light-1",
        targetHandle: null, // Default target
        type: "custom-edge",
        animated: true,
    },
];

function HeroCircuitFlow() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const { runSimulation } = useLogicEngine();

    // Run simulation whenever nodes (state) or edges change
    useEffect(() => {
        runSimulation(nodes, edges, setNodes, setEdges);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes.map((n) => (n.type === "switch" ? n.data.active : "")).join(","), edges.length]);
    // We listen to switch active state changes to trigger simulation.
    // However, runSimulation updates nodes, so we need to be careful about infinite loops if not handled.
    // The dependency array above tries to limit it to only when switch active state changes or edges change.

    // Actually, useLogicEngine's runSimulation usually runs based on an interval or direct call. 
    // In ChallengeFlow it was:
    // useEffect(() => { ... runSimulation ... }, [edges.length, connections string, switch states string])

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        []
    );

    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            if (node.type === "switch") {
                setNodes((nds) => {
                    const newNodes = nds.map((n) => {
                        if (n.id === node.id) {
                            return { ...n, data: { ...n.data, active: !n.data.active } };
                        }
                        return n;
                    });

                    // Trigger simulation immediately after state update
                    setTimeout(() => {
                        runSimulation(newNodes, edges, setNodes, setEdges);
                    }, 0);

                    return newNodes;
                });
            }
        },
        [runSimulation, edges]
    );

    return (
        <div className="w-full h-full bg-slate-50 relative">
            {/* Overlay to prevent panning/zooming if desired, or allow it but limited. 
                 For a hero section, maybe allow interaction but disable chaotic movement.
             */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange} // Allow moving nodes? User might like playing with it.
                onNodeClick={onNodeClick}
                fitView
                panOnScroll={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false} // Keep it static in place
                preventScrolling={false}
                attributionPosition="bottom-right"
            >
                <Background color="#e2e8f0" gap={16} />
            </ReactFlow>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-medium text-gray-500 shadow-sm">
                    Interactúa con los interruptores
                </span>
            </div>
        </div>
    );
}

export default function HeroCircuit() {
    return (
        <ReactFlowProvider>
            <HeroCircuitFlow />
        </ReactFlowProvider>
    );
}
