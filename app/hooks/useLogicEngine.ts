import { useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';

export const useLogicEngine = () => {
    // We receive current state as arguments to avoid stale closures in listeners if needed,
    // but typically we pass the setters.

    // Evaluate a single node's output based on its inputs
    const evaluateNode = (node: Node, inputs: boolean[]) => {
        const type = node.type;

        // Sources (Manual control)
        if (type === 'switch' || type === 'push-button') {
            return node.data.active as boolean;
        }

        // clock (Logic needed: interval) - for now behave as manual or static
        if (type === 'clock') return node.data.active as boolean;

        // Gates
        if (type === 'gate' || type === 'and-gate') {
            // Implicitly treat missing connections as FALSE. 
            // If connected inputs < 2, it means we have unconnected ports (assuming 2-input gate).
            // Logic: X AND 0 = 0.
            if (inputs.length < 2) return false;
            return inputs.every(v => v === true);
        }
        if (type === 'or-gate') {
            return inputs.some(v => v === true);
        }
        if (type === 'not-gate') {
            // NOT only considers the first input. If 0 inputs, assumes FALSE input -> TRUE output
            // But realistically, floating input = false.
            if (inputs.length === 0) return true;
            return !inputs[0];
        }
        if (type === 'xor-gate') {
            // True if odd number of true inputs
            return inputs.filter(v => v).length % 2 === 1;
        }

        // Output components (sink)
        // They are strictly "active" if they receive ANY high signal.
        if (type === 'light' || type === 'display') {
            return inputs.some(v => v === true);
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
            } else {
                nodeState[n.id] = false; // Default off
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

                // Get values of incoming edges
                const inputs = (incomingEdges[node.id] || []).map(edge => {
                    // An edge carries the signal of its source node
                    const sourceActive = nodeState[edge.source];
                    // Update edge visual state map while we are here
                    edgeState[edge.id] = sourceActive;
                    return sourceActive;
                });

                const newState = evaluateNode(node, inputs);

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
