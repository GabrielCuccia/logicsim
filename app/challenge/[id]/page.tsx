"use client";

import { use } from "react";
import React, { useCallback, useState, useRef, useMemo, useEffect } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
    SwitchNode,
    GateNode,
    LightNode,
    CustomEdge,
    AndGateNode,
    OrGateNode,
    NotGateNode,
    XorGateNode,
    PushButtonNode,
    ClockNode,
    DisplayNode,
    RelayNode,
    PowerSourceNode,
    RelayNCNode,
    NandGateNode,
    DLatchNode,
} from "../../components/CustomNodes";
import Sidebar from "../../components/Sidebar";
import ChallengePropertiesSidebar from "./ChallengePropertiesSidebar";
import ChallengeHeader from "./ChallengeHeader";
import { useLogicEngine } from "../../hooks/useLogicEngine";
import { getChallengeById } from "../../data/challenges";
import { validateChallenge } from "../../lib/challengeValidator";
import { markChallengeCompleted, isChallengeCompleted } from "../../lib/progress";
import { useRouter } from "next/navigation";
import { getChallengesByLevel } from "../../data/challenges";

const nodeTypes = {
    switch: SwitchNode,
    "push-button": PushButtonNode,
    clock: ClockNode,
    gate: GateNode,
    "and-gate": AndGateNode,
    "or-gate": OrGateNode,
    "not-gate": NotGateNode,
    "xor-gate": XorGateNode,
    "power-source": PowerSourceNode,
    "relay-nc": RelayNCNode,
    "nand-gate": NandGateNode,
    "d-latch": DLatchNode,
    relay: RelayNode,
    light: LightNode,
    display: DisplayNode,
};

const edgeTypes = {
    "custom-edge": CustomEdge,
};

const getId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function ChallengeFlow({ id }: { id: string }) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const { screenToFlowPosition } = useReactFlow();
    const { runSimulation } = useLogicEngine();
    const router = useRouter();

    const [validationResult, setValidationResult] = useState<{ success: boolean; message: string; details?: string[] } | null>(null);

    const challenge = getChallengeById(id);

    // Initialize challenge
    useEffect(() => {
        if (challenge) {
            setNodes(challenge.fixedNodes || []);
            setEdges(challenge.fixedEdges || []);
            setValidationResult(null);
        }
    }, [challenge]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.selected) || null,
        [nodes]
    );

    // Run simulation on changes
    useEffect(() => {
        if (challenge) {
            runSimulation(nodes, edges, setNodes, setEdges);
        }
    }, [edges.length, edges.map((e) => e.source + e.target).join(","), nodes.map(n => n.type === 'switch' ? n.data.active : '').join(',')]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            // Prevent deleting fixed nodes
            const filteredChanges = changes.filter(change => {
                if (change.type === 'remove') {
                    const node = nodes.find(n => n.id === change.id);
                    if (node?.data?.fixed) return false;
                }
                return true;
            });
            setNodes((nodesSnapshot) => applyNodeChanges(filteredChanges, nodesSnapshot));
        },
        [nodes]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        []
    );

    const onConnect = useCallback((params: Connection) => {
        setEdges((edgesSnapshot) =>
            addEdge({ ...params, animated: true, type: "custom-edge" }, edgesSnapshot)
        );
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");

            if (typeof type === "undefined" || !type) {
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
        [screenToFlowPosition]
    );

    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            if ((node.type === "switch" || node.type === "push-button") && !node.data.fixed) {
                // Interactive switches for testing, handled by simulation loop mostly
                // But for fixed input switches in challenges, we usually want them interactive too?
                // Yes, user toggles them to test truth table manually.
            }
            if (node.type === "switch" || node.type === "push-button") {
                setNodes((nds) => {
                    const newNodes = nds.map((n) => {
                        if (n.id === node.id) {
                            return { ...n, data: { ...n.data, active: !n.data.active } };
                        }
                        return n;
                    });

                    // Trigger simulation immediately
                    setTimeout(() => {
                        runSimulation(newNodes, edges, setNodes, setEdges);
                    }, 0);

                    return newNodes;
                });
            }
        },
        [runSimulation, edges]
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
        const node = nodes.find(n => n.id === id);
        if (node?.data?.fixed) return; // Cannot delete fixed nodes

        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) =>
            eds.filter((edge) => edge.source !== id && edge.target !== id)
        );
    }, [nodes]);

    const handleValidate = () => {
        if (!challenge) return;

        const result = validateChallenge(nodes, edges, challenge.goalCondition);
        setValidationResult(result);

        if (result.success) {
            markChallengeCompleted(challenge.id);
            // Optionally redirect or show success modal
        }
    };

    if (!challenge) {
        return <div className="p-8">Desafío no encontrado</div>;
    }

    return (
        <div className="flex flex-col w-screen h-screen overflow-hidden">
            <ChallengeHeader
                title={challenge.title}
                description={challenge.description}
                onVerify={handleValidate}
                isVerifying={false}
            />
            <div className="flex flex-grow w-full h-full overflow-hidden">
                <Sidebar allowedGates={challenge.allowedGates} />
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
                        <Background variant={BackgroundVariant.Lines} />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>

                    {/* Validation Message */}
                    {validationResult && (
                        <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-lg shadow-lg ${validationResult.success ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'} border`}>
                            <p className="font-bold">{validationResult.message}</p>
                            {validationResult.details && (
                                <ul className="mt-2 list-disc list-inside text-sm">
                                    {validationResult.details.map((detail, idx) => (
                                        <li key={idx}>{detail}</li>
                                    ))}
                                </ul>
                            )}
                            {validationResult.success && (
                                <button
                                    onClick={() => router.push('/')}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Volver al Inicio
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <ChallengePropertiesSidebar
                    selectedNode={selectedNode}
                    onDelete={onDeleteNode}
                    onLabelChange={onLabelChange}
                    goalCondition={challenge.goalCondition}
                    inputLabels={nodes.filter(n => n.type === 'switch').map(n => n.data.label as string)}
                />
            </div>
        </div>
    );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <ReactFlowProvider>
            <ChallengeFlow id={id} />
        </ReactFlowProvider>
    );
}
