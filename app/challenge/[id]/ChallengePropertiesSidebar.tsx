"use client";

import { Node } from "@xyflow/react";
import { Trash2, Settings, Table } from "lucide-react";
import { GoalCondition } from "../../types";

interface ChallengePropertiesSidebarProps {
    selectedNode: Node | null;
    onLabelChange: (id: string, newLabel: string) => void;
    onDelete: (id: string) => void;
    goalCondition: GoalCondition;
    inputLabels: string[];
}

export default function ChallengePropertiesSidebar({
    selectedNode,
    onLabelChange,
    onDelete,
    goalCondition,
    inputLabels
}: ChallengePropertiesSidebarProps) {
    // Check if node is fixed (can't be deleted)
    const isFixed = selectedNode?.data?.fixed === true;

    return (
        <aside className="w-72 bg-white border-l border-gray-200 h-full flex flex-col shadow-sm z-10 font-sans">
            {selectedNode ? (
                // Node selected - show properties
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="w-5 h-5 text-gray-500" />
                        <h2 className="font-bold text-gray-800">Propiedades</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Tipo
                            </label>
                            <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                                {selectedNode.type}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Etiqueta
                            </label>
                            <input
                                type="text"
                                value={(selectedNode.data?.label as string) || ""}
                                onChange={(e) => onLabelChange(selectedNode.id, e.target.value)}
                                disabled={isFixed}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {!isFixed && (
                            <button
                                onClick={() => onDelete(selectedNode.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar componente
                            </button>
                        )}

                        {isFixed && (
                            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                                Este componente es fijo y no puede ser modificado
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // No node selected - show truth table
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Table className="w-5 h-5 text-blue-500" />
                        <h2 className="font-bold text-gray-800">Tabla de Verdad</h2>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Tu circuito debe producir estas salidas:
                    </p>

                    {goalCondition.type === 'truth-table' && (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {inputLabels.map((label, i) => (
                                            <th key={i} className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                                                {label}
                                            </th>
                                        ))}
                                        <th className="px-3 py-2 text-center font-semibold text-blue-600 bg-blue-50">
                                            Salida
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goalCondition.expectedOutputs.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="border-t border-gray-200">
                                            {row.inputStates.map((state, colIndex) => (
                                                <td key={colIndex} className="px-3 py-2 text-center text-gray-700 border-r border-gray-200 last:border-r-0">
                                                    <span className={`inline-block w-6 h-6 rounded-full leading-6 text-xs font-bold ${state ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {state ? '1' : '0'}
                                                    </span>
                                                </td>
                                            ))}
                                            <td className="px-3 py-2 text-center bg-blue-50">
                                                <span className={`inline-block w-6 h-6 rounded-full leading-6 text-xs font-bold ${row.outputState ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                                    {row.outputState ? '1' : '0'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">
                            <strong>Tip:</strong> Conecta los componentes para que la salida coincida con la tabla de verdad. Click en "Verificar Solución" cuando termines.
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
