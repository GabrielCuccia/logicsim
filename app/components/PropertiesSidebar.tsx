"use client";

import React, { useEffect, useState } from 'react';
import { Trash2, Binary, ToggleRight, MousePointerClick, Clock, Box, CopyMinus, Triangle, MoveRight, Lightbulb, Monitor, Settings } from 'lucide-react';
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
        case 'light': return Lightbulb;
        case 'display': return Monitor;
        case 'relay': return "/relay.png";
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
            <aside className="w-80 bg-white border-l border-gray-200 h-screen p-6 flex flex-col shadow-sm z-10 transition-all duration-300">
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Settings className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium">Select a component to view properties</p>
                </div>
            </aside>
        );
    }

    const IconOrPath = getNodeIcon(selectedNode.type);

    return (
        <aside className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-sm z-10 font-sans">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-slate-800">Properties</h2>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{selectedNode.type?.replace('-', ' ')}</p>
            </div>

            <div className="p-6 flex-grow space-y-6">


                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        TYPE
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                            {typeof IconOrPath === 'string' ? (
                                <img src={IconOrPath} alt="type icon" className="w-5 h-5" />
                            ) : (
                                <IconOrPath className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                        <span className="font-semibold text-slate-700 capitalize">
                            {selectedNode.type?.replace(/-/g, ' ')}
                        </span>
                    </div>
                </div>


                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        LABEL
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={handleLabelChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium"
                        placeholder="Component Label"
                    />
                </div>


                {typeof selectedNode.data.active !== 'undefined' && (
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            STATE
                        </label>
                        <div className={`w-full p-3 rounded-lg border flex items-center gap-3 ${selectedNode.data.active ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center ${selectedNode.data.active ? 'bg-green-500' : 'bg-slate-300'}`}>
                                {selectedNode.data.active && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className={`text-sm font-semibold ${selectedNode.data.active ? 'text-green-700' : 'text-slate-500'}`}>
                                {selectedNode.data.active ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>
                )}

            </div>

            <div className="p-6 border-t border-gray-100 bg-slate-50">
                <button
                    onClick={() => onDelete(selectedNode.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Component
                </button>
            </div>
        </aside>
    );
}
