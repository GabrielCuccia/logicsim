import { useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';

export const useLogicEngine = () => {
    // We receive current state as arguments to avoid stale closures in listeners if needed,
    // but typically we pass the setters.

    // Evaluate a single node's output based on its inputs
    const evaluateNode = (node: Node, incomingEdges: Edge[], nodeStates: Record<string, boolean>) => {
        const type = node.type;

        // Sources (Manual control)
        if (type === 'switch' || type === 'push-button') {
            return node.data.active as boolean;
        }

        // clock (Logic needed: interval) - for now behave as manual or static
        if (type === 'clock') return node.data.active as boolean;

        // Power Source: Always True
        if (type === 'power-source') return true;

        // Helper to get values from edges
        const inputValues = incomingEdges.map(e => nodeStates[e.source] || false);

        // Gates
        if (type === 'gate' || type === 'and-gate') {
            // Implicitly treat missing connections as FALSE. 
            // If connected inputs < 2, it means we have unconnected ports (assuming 2-input gate).
            // Logic: X AND 0 = 0.
            if (inputValues.length < 2) return false;
            return inputValues.every(v => v === true);
        }
        if (type === 'or-gate') {
            return inputValues.some(v => v === true);
        }
        if (type === 'not-gate') {
            // NOT only considers the first input. If 0 inputs, assumes FALSE input -> TRUE output
            // But realistically, floating input = false.
            if (inputValues.length === 0) return true;
            return !inputValues[0];
        }
        if (type === 'xor-gate') {
            // True if odd number of true inputs
            return inputValues.filter(v => v).length % 2 === 1;
        }
        if (type === 'nand-gate') {
            // NAND = NOT (AND)
            // If inputs < 2, assume FALSE for missing inputs? 
            // Standard: NAND(1, 1) = 0. Else 1.
            // If unconnected (0 inputs), usually output 1 (like NOT 0).
            if (inputValues.length < 2) return true; // Treat missing as 0. 0 AND X = 0 -> NAND = 1.
            return !inputValues.every(v => v === true);
        }

        if (type === 'd-latch') {
            const enableEdges = incomingEdges.filter(e => e.targetHandle === 'enable');
            const dataEdges = incomingEdges.filter(e => e.targetHandle === 'data');

            const enableActive = enableEdges.some(e => nodeStates[e.source]);
            const dataActive = dataEdges.some(e => nodeStates[e.source]);

            // D-Latch Logic:
            // If Enable is HIGH, Output follows Data (Transparent).
            // If Enable is LOW, Output holds previous state.

            // Note: node.data.active holds the PREVIOUS state because we initialized nodeState from it
            // and haven't updated it for this node in this tick yet (unless we loop, but topological sort usually handles it).
            // However, useLogicEngine calculates newState based on `nodeState`. 
            // `nodeState[node.id]` currently holds the value from the previous tick (persisted start).

            if (enableActive) {
                return dataActive;
            } else {
                return nodeStates[node.id] || false; // Keep previous state
            }
        }

        // Relay Logic
        if (type === 'relay') {
            // Needs two inputs: 'control' and 'signal'
            // Support multiple connections to same handle (OR logic)
            const controlEdges = incomingEdges.filter(e => e.targetHandle === 'control');
            const signalEdges = incomingEdges.filter(e => e.targetHandle === 'signal');

            const controlActive = controlEdges.some(e => nodeStates[e.source]);
            const signalActive = signalEdges.some(e => nodeStates[e.source]);

            // If control is active, output = signal. Else output = false (open circuit)
            return controlActive && signalActive;
        }

        // Relay NC Logic (Normally Closed)
        if (type === 'relay-nc') {
            const controlEdges = incomingEdges.filter(e => e.targetHandle === 'control');
            const signalEdges = incomingEdges.filter(e => e.targetHandle === 'signal');

            const controlActive = controlEdges.some(e => nodeStates[e.source]); // If any control is hot, coil activates (opens circuit)
            const signalActive = signalEdges.some(e => nodeStates[e.source]);

            // Logic: (!Control) AND Signal
            return !controlActive && signalActive;
        }

        // Output components (sink)
        // They are strictly "active" if they receive ANY high signal.
        if (type === 'light' || type === 'display') {
            return inputValues.some(v => v === true);
        }

        // Pass-through or other
        return false;
    };


    const runSimulation = useCallback((nodes: Node[], edges: Edge[], setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>) => {

        // 1. Build Adjacency Graph & In-Degree map
        const adj: Record<string, string[]> = {}; // nodeID -> [targetNodeIDs]
        const incomingEdges: Record<string, Edge[]> = {}; // nodeID -> [Edges coming into this node]

        nodes.forEach(n => {
            adj[n.id] = [];
            incomingEdges[n.id] = [];
        });

        edges.forEach(e => {
            if (adj[e.source]) adj[e.source].push(e.target);
            if (!incomingEdges[e.target]) incomingEdges[e.target] = [];
            incomingEdges[e.target].push(e);
        });

        // 2. Identify Sources and Initial State
        // We will do a topological-like simulation. 
        // Since cycles might exist, we'll iterate until stability or max depth.
        // For simplicity: We calculate everything from scratch based on Switch/Clock states.

        // Initialize temporary state map
        const nodeState: Record<string, boolean> = {};
        const edgeState: Record<string, boolean> = {};

        // Pre-fill sources
        nodes.forEach(n => {
            if (n.type === 'switch' || n.type === 'push-button' || n.type === 'clock') {
                nodeState[n.id] = n.data.active as boolean;
            } else if (n.type === 'power-source') {
                nodeState[n.id] = true;
            } else {
                // SEQUENTIAL LOGIC FIX:
                // Initialize with current state to allow memory/feedback loops.
                // If undefined, default to false.
                nodeState[n.id] = (n.data.active as boolean) || false;
            }
        });

        const MAX_ITERATIONS = 100; // Prevent infinite loops
        let changed = true;
        let iter = 0;

        while (changed && iter < MAX_ITERATIONS) {
            changed = false;

            // For every node, calculate its new output based on CURRENT input states
            for (const node of nodes) {
                // Skip sources, their state is fixed by user interaction
                if (node.type === 'switch' || node.type === 'push-button' || node.type === 'clock') continue;

                const currentIncomingEdges = incomingEdges[node.id] || [];
                // Update edge visual state map while we are here
                currentIncomingEdges.forEach(edge => {
                    edgeState[edge.id] = nodeState[edge.source];
                });

                const newState = evaluateNode(node, currentIncomingEdges, nodeState);

                if (nodeState[node.id] !== newState) {
                    nodeState[node.id] = newState;
                    changed = true;
                }
            }
            iter++;
        }

        // 3. Apply updates to React State
        // Only update if something visually changes to avoid infinite re-renders if called in useEffect
        // Actually, we should just set the state.

        let nodesChanged = false;
        const newNodes = nodes.map(n => {
            if (n.data.active !== nodeState[n.id]) {
                nodesChanged = true;
                return { ...n, data: { ...n.data, active: nodeState[n.id] } };
            }
            return n;
        });

        let edgesChanged = false;
        const newEdges = edges.map(e => {
            const isActive = nodeState[e.source]; // Edge is active if its source is active
            const currentColor = e.style?.stroke;
            const newColor = isActive ? '#3b82f6' : '#9ca3af'; // Blue vs Gray

            if (currentColor !== newColor) {
                edgesChanged = true;
                return { ...e, animated: true, style: { ...e.style, stroke: newColor } };
            }
            return e;
        });

        if (nodesChanged) setNodes(newNodes);
        if (edgesChanged) setEdges(newEdges);

    }, []);

    return { runSimulation };
};
