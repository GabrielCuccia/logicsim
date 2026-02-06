import { Challenge } from "../types";

export const challenges: Challenge[] = [
    // 1. Crear NAND con Relays
    {
        id: "challenge_1",
        title: "La Piedra Angular (NAND)",
        description: "Construye una compuerta NAND usando Relays. Tienes un Relay Normal y uno Normalmente Cerrado (NC). La salida debe ser FALSA solo si ambas entradas son VERDADERAS.",
        level: "Hardware",
        requiredLevel: 1,
        locked: false,
        allowedGates: ['switch', 'light', 'power-source', 'relay', 'relay-nc'],
        fixedNodes: [
            { id: 'sw_a', type: 'switch', position: { x: 50, y: 100 }, data: { label: 'Input A', active: false, fixed: true } },
            { id: 'sw_b', type: 'switch', position: { x: 50, y: 200 }, data: { label: 'Input B', active: false, fixed: true } },
            { id: 'power', type: 'power-source', position: { x: 50, y: 300 }, data: { label: 'Power', active: true, fixed: true } },
            { id: 'light', type: 'light', position: { x: 600, y: 150 }, data: { label: 'Output', active: false, fixed: true } },
        ],
        fixedEdges: [],
        goalCondition: {
            type: 'truth-table',
            expectedOutputs: [
                { inputStates: [false, false], outputState: true },
                { inputStates: [false, true], outputState: true },
                { inputStates: [true, false], outputState: true },
                { inputStates: [true, true], outputState: false },
            ]
        }
    },

    // 2. Crear NOT con NAND
    {
        id: "challenge_2",
        title: "Inversion (NOT)",
        description: "Obtuviste una compuerta NAND. Ahora úsala para construir un inversor (NOT). Si la entrada es 1, la salida es 0.",
        level: "Lógica Básica",
        requiredLevel: 2,
        locked: true,
        allowedGates: ['switch', 'light', 'nand-gate'],
        fixedNodes: [
            { id: 'sw_in', type: 'switch', position: { x: 50, y: 150 }, data: { label: 'Input', active: false, fixed: true } },
            { id: 'light', type: 'light', position: { x: 500, y: 150 }, data: { label: 'Output', active: false, fixed: true } },
        ],
        fixedEdges: [],
        goalCondition: {
            type: 'truth-table',
            expectedOutputs: [
                { inputStates: [false], outputState: true },
                { inputStates: [true], outputState: false },
            ]
        }
    },

    // 3. Crear AND con NANDs
    {
        id: "challenge_3",
        title: "Conjunción (AND)",
        description: "Construye una compuerta AND usando solo compuertas NAND.",
        level: "Lógica Básica",
        requiredLevel: 3,
        locked: true,
        allowedGates: ['switch', 'light', 'nand-gate'],
        fixedNodes: [
            { id: 'sw_a', type: 'switch', position: { x: 50, y: 100 }, data: { label: 'A', active: false, fixed: true } },
            { id: 'sw_b', type: 'switch', position: { x: 50, y: 200 }, data: { label: 'B', active: false, fixed: true } },
            { id: 'light', type: 'light', position: { x: 600, y: 150 }, data: { label: 'Output', active: false, fixed: true } },
        ],
        fixedEdges: [],
        goalCondition: {
            type: 'truth-table',
            expectedOutputs: [
                { inputStates: [false, false], outputState: false },
                { inputStates: [false, true], outputState: false },
                { inputStates: [true, false], outputState: false },
                { inputStates: [true, true], outputState: true },
            ]
        }
    },

    // 4. Crear OR con NANDs
    {
        id: "challenge_4",
        title: "Disyunción (OR)",
        description: "Construye una compuerta OR usando solo compuertas NAND (y la lógica que has aprendido).",
        level: "Lógica Básica",
        requiredLevel: 4,
        locked: true,
        allowedGates: ['switch', 'light', 'nand-gate'],
        fixedNodes: [
            { id: 'sw_a', type: 'switch', position: { x: 50, y: 100 }, data: { label: 'A', active: false, fixed: true } },
            { id: 'sw_b', type: 'switch', position: { x: 50, y: 200 }, data: { label: 'B', active: false, fixed: true } },
            { id: 'light', type: 'light', position: { x: 600, y: 150 }, data: { label: 'Output', active: false, fixed: true } },
        ],
        fixedEdges: [],
        goalCondition: {
            type: 'truth-table',
            expectedOutputs: [
                { inputStates: [false, false], outputState: false },
                { inputStates: [false, true], outputState: true },
                { inputStates: [true, false], outputState: true },
                { inputStates: [true, true], outputState: true },
            ]
        }
    },

    // 5. Crear XOR con NANDs
    {
        id: "challenge_5",
        title: "Exclusividad (XOR)",
        description: "El desafío final de este nivel: Construye una compuerta XOR usando solo compuertas NAND.",
        level: "Lógica Avanzada",
        requiredLevel: 5,
        locked: true,
        allowedGates: ['switch', 'light', 'nand-gate'],
        fixedNodes: [
            { id: 'sw_a', type: 'switch', position: { x: 50, y: 100 }, data: { label: 'A', active: false, fixed: true } },
            { id: 'sw_b', type: 'switch', position: { x: 50, y: 200 }, data: { label: 'B', active: false, fixed: true } },
            { id: 'light', type: 'light', position: { x: 600, y: 150 }, data: { label: 'Output', active: false, fixed: true } },
        ],
        fixedEdges: [],
        goalCondition: {
            type: 'truth-table',
            expectedOutputs: [
                { inputStates: [false, false], outputState: false },
                { inputStates: [false, true], outputState: true },
                { inputStates: [true, false], outputState: true },
                { inputStates: [true, true], outputState: false },
            ]
        }
    },
    {
        id: "challenge_6",
        title: "Memoria (Latch)",
        description: "Construye un circuito capaz de recordar información. Un Latch D simple. Si Enable (E) está encendido, la salida sigue a Data (D). Si E está apagado, la salida MANTIENE su valor anterior (Memoria).",
        level: "Lógica Avanzada",
        requiredLevel: 6,
        locked: true,
        allowedGates: ['switch', 'light', 'nand-gate', 'not-gate'],
        goalCondition: {
            type: 'truth-table',
            expectedOutputs: [
                // Testing sequence is tricky with truth table for memory.
                // We need to assume state carry-over or specific sequence
                // For now, simpler test: Transparent mode
                { inputStates: [true, false], outputState: false }, // E=1, D=0 -> Q=0
                { inputStates: [true, true], outputState: true },   // E=1, D=1 -> Q=1
                // Hold mode (Memory)
                { inputStates: [false, false], outputState: true }, // E=0, D=0 -> Q=1 (Holds previous 1)
                { inputStates: [true, false], outputState: false }, // Reset: E=1, D=0 -> Q=0
                { inputStates: [false, true], outputState: false }, // E=0, D=1 -> Q=0 (Holds previous 0)
            ]
        },
        fixedNodes: [
            { id: 'enable', type: 'switch', position: { x: 50, y: 100 }, data: { label: 'Enable', active: false, fixed: true }, draggable: false },
            { id: 'data', type: 'switch', position: { x: 50, y: 300 }, data: { label: 'Data', active: false, fixed: true }, draggable: false },
            { id: 'light', type: 'light', position: { x: 600, y: 200 }, data: { label: 'Q (Output)', fixed: true }, draggable: false },
        ],
        fixedEdges: []
    }
];

export const getChallengesByLevel = (level: string) => {
    return challenges.filter(c => c.level === level);
};

export const getChallengeById = (id: string) => {
    return challenges.find(c => c.id === id);
};
