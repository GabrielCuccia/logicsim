"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Binary, ToggleRight, MousePointerClick, Clock, Lightbulb, Monitor, Settings, Zap } from 'lucide-react';
import { Node } from '@xyflow/react';

interface PropertiesSidebarProps {
    selectedNode: Node | null;
    onLabelChange: (id: string, newLabel: string) => void;
    onDelete: (id: string) => void;
}

const getNodeIcon = (type: string | undefined) => {
    switch (type) {
        case 'switch': return ToggleRight;
        case 'push-button': return MousePointerClick;
        case 'clock': return Clock;
        case 'gate': return Binary;
        case 'and-gate': return "/compuerta-and.png";
        case 'or-gate': return "/compuerta-or.png";
        case 'not-gate': return "/compuerta-not.png";
        case 'xor-gate': return "/compuerta-xor.png";
        case 'nand-gate': return "/compuerta-and.png";
        case 'd-latch': return "/compuerta-and.png";
        case 'light': return Lightbulb;
        case 'display': return Monitor;
        case 'relay': return "/relay.png";
        case 'relay-nc': return "/relay.png";
        case 'power-source': return Zap;
        default: return Settings;
    }
};

export default function PropertiesSidebar({ selectedNode, onLabelChange, onDelete }: PropertiesSidebarProps) {
    const [label, setLabel] = useState('');

    useEffect(() => {
        if (selectedNode) {
            setLabel((selectedNode.data.label as string) || '');
        }
    }, [selectedNode]);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = e.target.value;
        setLabel(newLabel);
        if (selectedNode) {
            onLabelChange(selectedNode.id, newLabel);
        }
    };

    if (!selectedNode) {
        return (
            <aside className="w-80 bg-white border-l border-gray-200 h-screen flex flex-col shadow-sm z-10 transition-all duration-300 font-sans">
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                    <Settings className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Selecciona un componente para ver detalles</p>
                </div>
            </aside>
        );
    }

    const IconOrPath = getNodeIcon(selectedNode.type);

    return (
        <aside className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-sm z-10 font-sans">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <h2 className="font-bold text-gray-800">Propiedades</h2>
                </div>
            </div>

            <div className="p-4 flex-grow space-y-6">

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                        TIPO
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100 flex items-center justify-center">
                            {typeof IconOrPath === 'string' ? (
                                <img src={IconOrPath} alt="type icon" className="w-5 h-5" />
                            ) : (
                                <IconOrPath className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                        <span className="font-semibold text-gray-700 capitalize text-sm">
                            {selectedNode.type?.replace(/-/g, ' ')}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                        ETIQUETA
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={handleLabelChange}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 font-medium placeholder:text-gray-400"
                        placeholder="Nombre del componente"
                    />
                </div>

                {typeof selectedNode.data.active !== 'undefined' && (
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                            ESTADO
                        </label>
                        <div className={`w-full p-3 rounded-lg border flex items-center gap-3 ${selectedNode.data.active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${selectedNode.data.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                {selectedNode.data.active && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`text-sm font-semibold ${selectedNode.data.active ? 'text-green-700' : 'text-gray-500'}`}>
                                {selectedNode.data.active ? 'ENCENDIDO' : 'APAGADO'}
                            </span>
                        </div>
                    </div>
                )}

            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                    onClick={() => onDelete(selectedNode.id)}
                    className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Eliminar componente
                </button>
            </div>
        </aside>
    );
}
