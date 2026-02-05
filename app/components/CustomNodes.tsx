"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps, BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from '@xyflow/react';
import { ToggleLeft, ToggleRight, Lightbulb, Binary, X, MousePointerClick, Clock, Box, CopyMinus, Triangle, MoveRight, Monitor } from 'lucide-react';

const BaseNode = ({ children, isActive, color = "border-gray-200", bg = "bg-white" }: { children: React.ReactNode, isActive?: boolean, color?: string, bg?: string }) => (
    <div className={`p-3 rounded-xl shadow-md border ${isActive ? 'border-green-400 bg-green-50' : `${color} ${bg}`} transition-colors duration-200 min-w-[60px] flex justify-center items-center`}>
        {children}
    </div>
);

export const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
}: EdgeProps) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            {selected && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            fontSize: 12,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <button
                            className="bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-600 transition-colors shadow-md border-2 border-white"
                            onClick={onEdgeClick}
                            title="Delete Edge"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};


export const SwitchNode = memo(({ data }: NodeProps) => {
    const isActive = data.active as boolean;
    return (
        <BaseNode isActive={isActive}>
            {isActive ? (
                <ToggleRight className="w-8 h-8 text-green-600" />
            ) : (
                <ToggleLeft className="w-8 h-8 text-gray-400" />
            )}
            <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-3 !h-3 !-right-1.5" />
        </BaseNode>
    );
});

export const PushButtonNode = memo(({ data }: NodeProps) => {
    const isActive = data.active as boolean;
    return (
        <BaseNode isActive={isActive}>
            <MousePointerClick className={`w-8 h-8 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
            <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-3 !h-3 !-right-1.5" />
        </BaseNode>
    );
});

export const ClockNode = memo(({ data }: NodeProps) => {
    const isActive = data.active as boolean;
    return (
        <BaseNode isActive={isActive} color="border-purple-200">
            <Clock className={`w-8 h-8 ${isActive ? 'text-purple-600 animate-pulse' : 'text-gray-400'}`} />
            <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-3 !h-3 !-right-1.5" />
        </BaseNode>
    );
});

// Logic Gates
const GateHandleConfig = () => (
    <>
        <Handle type="target" position={Position.Left} id="a" className="!bg-gray-300 !w-3 !h-3 !-left-1.5 !top-1/3" />
        <Handle type="target" position={Position.Left} id="b" className="!bg-gray-300 !w-3 !h-3 !-left-1.5 !top-2/3" />
        <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-3 !h-3 !-right-1.5" />
    </>
);

const NotHandleConfig = () => (
    <>
        <Handle type="target" position={Position.Left} id="in" className="!bg-gray-300 !w-3 !h-3 !-left-1.5" />
        <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-3 !h-3 !-right-1.5" />
    </>
);


export const GateNode = memo(({ data }: NodeProps) => { // Generic fallback
    return (
        <BaseNode color="border-blue-500">
            <Binary className="w-6 h-6 text-gray-700" />
            <GateHandleConfig />
        </BaseNode>
    );
});

export const AndGateNode = memo(({ data }: NodeProps) => (
    <BaseNode color="border-blue-500">
        <div className="flex flex-col items-center">
            <img src="/compuerta-and.png" alt="compuerta-and" className="w-8 h-8" />
            <span className="text-[10px] font-bold text-blue-600 mt-1">AND</span>
        </div>
        <GateHandleConfig />
    </BaseNode>
));

export const OrGateNode = memo(({ data }: NodeProps) => (
    <BaseNode color="border-blue-500">
        <div className="flex flex-col items-center">
            <img src="/compuerta-or.png" alt="compuerta-or" className="w-8 h-8" />

            <span className="text-[10px] font-bold text-blue-600 mt-1">OR</span>
        </div>
        <GateHandleConfig />
    </BaseNode>
));

export const NotGateNode = memo(({ data }: NodeProps) => (
    <BaseNode color="border-blue-500">
        <div className="flex flex-col items-center">
            <img src="/compuerta-not.png" alt="compuerta-not" className="w-8 h-8" />
            <span className="text-[10px] font-bold text-blue-600 mt-1">NOT</span>
        </div>
        <NotHandleConfig />
    </BaseNode>
));

export const XorGateNode = memo(({ data }: NodeProps) => (
    <BaseNode color="border-blue-500">
        <div className="flex flex-col items-center">
            <img src="/compuerta-xor.png" alt="compuerta-xor" className="w-8 h-8" />
            <span className="text-[10px] font-bold text-blue-600 mt-1">XOR</span>
        </div>
        <GateHandleConfig />
    </BaseNode>
));


// Outputs
export const LightNode = memo(({ data }: NodeProps) => {
    const isActive = data.active as boolean;
    return (
        <BaseNode
            isActive={false} // Force BaseNode to use custom colors
            color={isActive ? 'border-yellow-400' : 'border-gray-200'}
            bg={isActive ? 'bg-yellow-50' : 'bg-white'}
        >
            <Lightbulb className={`w-8 h-8 ${isActive ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
            <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-3 !h-3 !-left-1.5" />
        </BaseNode>
    );
});

export const DisplayNode = memo(({ data }: NodeProps) => {
    const isActive = data.active as boolean;
    return (
        <BaseNode isActive={isActive} color="border-slate-400">
            <div className={`w-16 h-10 ${isActive ? 'bg-green-100' : 'bg-slate-100'} rounded-md flex items-center justify-center border inner-shadow`}>
                <span className={`font-mono text-xl font-bold ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
                    {isActive ? 'ON' : 'OFF'}
                </span>
            </div>
            <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-3 !h-3 !-left-1.5" />
        </BaseNode>
    );
});
