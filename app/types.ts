import { Node, Edge } from "@xyflow/react";

export interface Project {
    id: string;
    name: string;
    description: string;
    updatedAt: string;
    nodes: Node[];
    edges: Edge[];
}

export interface GoalCondition {
    type: 'truth-table' | 'output-state';
    expectedOutputs: { inputStates: boolean[]; outputState: boolean }[];
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Hardware' | 'Lógica Básica' | 'Lógica Avanzada';
    requiredLevel: number;
    locked: boolean;
    allowedGates: string[];
    fixedNodes: Node[];
    fixedEdges: Edge[];
    goalCondition: GoalCondition;
}
