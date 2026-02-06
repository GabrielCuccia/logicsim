import { Node, Edge } from "@xyflow/react";
import { GoalCondition } from "../types";

interface ValidationResult {
    success: boolean;
    message: string;
    details?: string[];
}

// Simple logic simulation for validation
function simulateCircuit(
    nodes: Node[],
    edges: Edge[],
    inputStates: Map<string, boolean>
): Map<string, boolean> {
    const nodeStates = new Map<string, boolean>();

    // Initialize input states
    nodes.forEach(node => {
        if (node.type === 'switch') {
            const inputState = inputStates.get(node.id);
            nodeStates.set(node.id, inputState !== undefined ? inputState : false);
        } else if (node.type === 'power-source') {
            nodeStates.set(node.id, true);
        }
    });

    // Propagate through the circuit (multiple passes for complex circuits)
    for (let pass = 0; pass < 10; pass++) {
        let changed = false;

        nodes.forEach(node => {
            if (node.type === 'switch') return; // Skip inputs

            // Get all incoming edges
            const incomingEdges = edges.filter(e => e.target === node.id);
            const inputValues: boolean[] = [];

            incomingEdges.forEach(edge => {
                const sourceState = nodeStates.get(edge.source);
                if (sourceState !== undefined) {
                    inputValues.push(sourceState);
                }
            });

            let output: boolean | undefined;

            switch (node.type) {
                case 'and-gate':
                    if (inputValues.length >= 2) {
                        output = inputValues.every(v => v === true);
                    }
                    break;
                case 'or-gate':
                    if (inputValues.length >= 2) {
                        output = inputValues.some(v => v === true);
                    }
                    break;
                case 'not-gate':
                    if (inputValues.length >= 1) {
                        output = !inputValues[0];
                    }
                    break;
                case 'xor-gate':
                    if (inputValues.length >= 2) {
                        output = inputValues.filter(v => v === true).length % 2 === 1;
                    }
                    break;
                case 'd-latch':
                    {
                        const enableEdges = incomingEdges.filter(e => e.targetHandle === 'enable');
                        const dataEdges = incomingEdges.filter(e => e.targetHandle === 'data');

                        const enableActive = enableEdges.some(e => nodeStates.get(e.source));
                        const dataActive = dataEdges.some(e => nodeStates.get(e.source));
                        const previousState = nodeStates.get(node.id) || false;

                        if (enableActive) output = dataActive;
                        else output = previousState;
                    }
                    break;
                case 'nand-gate':
                    if (inputValues.length < 2) output = true;
                    else output = !inputValues.every(v => v === true);
                    break;
                case 'light':
                    if (inputValues.length >= 1) {
                        output = inputValues.some(v => v === true);
                    }
                    break;
                case 'relay':
                    {
                        const controlEdges = incomingEdges.filter(e => e.targetHandle === 'control');
                        const signalEdges = incomingEdges.filter(e => e.targetHandle === 'signal');

                        const controlActive = controlEdges.some(e => nodeStates.get(e.source));
                        const signalActive = signalEdges.some(e => nodeStates.get(e.source));

                        output = controlActive && signalActive;
                    }
                    break;
                case 'relay-nc':
                    {
                        const controlEdges = incomingEdges.filter(e => e.targetHandle === 'control');
                        const signalEdges = incomingEdges.filter(e => e.targetHandle === 'signal');

                        const controlActive = controlEdges.some(e => nodeStates.get(e.source));
                        const signalActive = signalEdges.some(e => nodeStates.get(e.source));

                        output = !controlActive && signalActive;
                    }
                    break;
            }

            if (output !== undefined && nodeStates.get(node.id) !== output) {
                nodeStates.set(node.id, output);
                changed = true;
            }
        });

        if (!changed) break;
    }

    return nodeStates;
}

export function validateChallenge(
    nodes: Node[],
    edges: Edge[],
    goalCondition: GoalCondition
): ValidationResult {
    if (goalCondition.type !== 'truth-table') {
        return { success: false, message: "Tipo de validación no soportado" };
    }

    // Find input and output nodes
    const inputNodes = nodes.filter(n => n.type === 'switch');
    const outputNodes = nodes.filter(n => n.type === 'light');

    if (outputNodes.length === 0) {
        return { success: false, message: "No se encontró ninguna salida conectada" };
    }

    // Check if there are any edges connecting to outputs
    const outputEdges = edges.filter(e => outputNodes.some(o => o.id === e.target));
    if (outputEdges.length === 0) {
        return { success: false, message: "La salida no está conectada a ningún circuito" };
    }

    const failedCases: string[] = [];

    // Test each row of the truth table
    for (const expected of goalCondition.expectedOutputs) {
        const inputStates = new Map<string, boolean>();

        // Set up input states based on expected.inputStates
        inputNodes.forEach((node, index) => {
            if (index < expected.inputStates.length) {
                inputStates.set(node.id, expected.inputStates[index]);
            }
        });

        // Simulate the circuit
        const results = simulateCircuit(nodes, edges, inputStates);

        // Check output
        const outputNode = outputNodes[0]; // First output for now
        const actualOutput = results.get(outputNode.id) || false;

        if (actualOutput !== expected.outputState) {
            const inputStr = expected.inputStates.map(s => s ? '1' : '0').join(', ');
            failedCases.push(`Entradas [${inputStr}]: esperado ${expected.outputState ? '1' : '0'}, obtenido ${actualOutput ? '1' : '0'}`);
        }
    }

    if (failedCases.length === 0) {
        return {
            success: true,
            message: "¡Excelente! Tu circuito es correcto. La tabla de verdad coincide."
        };
    } else {
        return {
            success: false,
            message: `El circuito no pasó todas las pruebas (${failedCases.length}/${goalCondition.expectedOutputs.length} fallaron)`,
            details: failedCases
        };
    }
}
