"use client";

import { use } from "react";
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
import { useCallback, useState, useRef, useMemo, useEffect } from "react";
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
} from "../../components/CustomNodes";
import Sidebar from "../../components/Sidebar";
import PropertiesSidebar from "../../components/PropertiesSidebar";
import { useLogicEngine } from "../../hooks/useLogicEngine";
import SimulatorHeader from "./SimulatorHeader";
import { getProjectById, updateProjectData } from "../../lib/storage";

const nodeTypes = {
    switch: SwitchNode,
    "push-button": PushButtonNode,
    clock: ClockNode,
    gate: GateNode,
    "and-gate": AndGateNode,
    "or-gate": OrGateNode,
    "not-gate": NotGateNode,
    "xor-gate": XorGateNode,
    relay: RelayNode,
    light: LightNode,
    display: DisplayNode,
};

const edgeTypes = {
    "custom-edge": CustomEdge,
};

const getId = () =>
    `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface FlowProps {
    projectId: string;
}

function Flow({ projectId }: FlowProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [projectName, setProjectName] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const { screenToFlowPosition } = useReactFlow();
    const { runSimulation } = useLogicEngine();

    // Load project from localStorage
    useEffect(() => {
        const project = getProjectById(projectId);
        if (project) {
            setNodes(project.nodes || []);
            setEdges(project.edges || []);
            setProjectName(project.name);
        }
        setIsLoaded(true);
    }, [projectId]);

    // Auto-save to localStorage when nodes/edges change
    useEffect(() => {
        if (isLoaded && projectId) {
            const timeoutId = setTimeout(() => {
                updateProjectData(projectId, nodes, edges);
            }, 500); // Debounce 500ms
            return () => clearTimeout(timeoutId);
        }
    }, [nodes, edges, projectId, isLoaded]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.selected) || null,
        [nodes]
    );

    useEffect(() => {
        if (isLoaded) {
            runSimulation(nodes, edges, setNodes, setEdges);
        }
    }, [edges.length, edges.map((e) => e.source + e.target).join(","), isLoaded]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        []
    );
    const onConnect = useCallback((params: Connection) => {
        setEdges((edgesSnapshot) => {
            const newEdges = addEdge(
                { ...params, animated: true, type: "custom-edge" },
                edgesSnapshot
            );
            return newEdges;
        });
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
        setEdges((eds) =>
            eds.filter((edge) => edge.source !== id && edge.target !== id)
        );
    }, []);

    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            if (node.type === "switch" || node.type === "push-button") {
                setNodes((nds) => {
                    const newNodes = nds.map((n) => {
                        if (n.id === node.id) {
                            return { ...n, data: { ...n.data, active: !n.data.active } };
                        }
                        return n;
                    });

                    setTimeout(() => {
                        runSimulation(newNodes, edges, setNodes, setEdges);
                    }, 0);
                    return newNodes;
                });
            }
        },
        [edges, runSimulation]
    );

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-lg text-gray-600">Cargando proyecto...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-screen h-screen overflow-hidden">
            <SimulatorHeader projectName={projectName} />
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
                        <Background
                            variant={BackgroundVariant.Lines}
                            gap={24}
                            size={1}
                            color="#f0f0f0"
                            className="bg-white"
                        />
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

export default function SimulatorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    return (
        <ReactFlowProvider>
            <Flow projectId={id} />
        </ReactFlowProvider>
    );
}
