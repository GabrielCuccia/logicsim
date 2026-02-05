"use client";

import React from 'react';
import { Search, ToggleRight, MousePointerClick, Clock, Box, PlayCircle, Lightbulb, Monitor, Triangle, CopyMinus, MoveRight } from 'lucide-react';

export default function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const components = {
        inputs: [
            { type: 'switch', label: 'Switch', icon: ToggleRight, color: 'text-emerald-500', bg: 'bg-emerald-100' },
            //{ type: 'push-button', label: 'Push Button', icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-100' },
            //{ type: 'clock', label: 'Clock', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-100' },
        ],
        gates: [
            { type: 'and-gate', label: 'AND Gate', icon: "/compuerta-and.png", color: 'text-blue-500', bg: 'bg-blue-100' },
            { type: 'or-gate', label: 'OR Gate', icon: "/compuerta-or.png", color: 'text-blue-500', bg: 'bg-blue-100' },
            { type: 'not-gate', label: 'NOT Gate', icon: "/compuerta-not.png", color: 'text-blue-500', bg: 'bg-blue-100' }, // Using Triangle as proxy for NOT
            { type: 'xor-gate', label: 'XOR Gate', icon: "/compuerta-xor.png", color: 'text-blue-500', bg: 'bg-blue-100' },
        ],
        outputs: [
            { type: 'light', label: 'Bulb', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-100' },
            //{ type: 'display', label: 'Display', icon: Monitor, color: 'text-amber-500', bg: 'bg-amber-100' },
        ]
    };

    return (
        <aside className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm z-10 overflow-y-auto font-sans">

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search components..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-700"
                    />
                </div>
            </div>

            <div className="p-4 space-y-8">

                {/* Helper function for sections */}
                {Object.entries(components).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
                            {category.replace('-', ' ')}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {items.map((item) => (
                                <div
                                    key={item.type}
                                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 cursor-grab hover:border-blue-400 hover:shadow-md transition-all bg-white group active:scale-95"
                                    onDragStart={(event) => onDragStart(event, item.type)}
                                    draggable
                                >
                                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        {typeof item.icon === 'string' ? (
                                            <img src={item.icon} alt={item.label} className={`w-6 h-6`} />
                                        ) : (
                                            <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={2} />
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </aside>
    );
}
