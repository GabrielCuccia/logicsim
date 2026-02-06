"use client";

import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

interface SimulatorHeaderProps {
    projectName: string;
}

export default function SimulatorHeader({ projectName }: SimulatorHeaderProps) {
    return (
        <header className="h-22 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative">

            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Volver</span>
                </Link>

                <div className="h-6 w-px bg-gray-300" />

                <div className="flex items-center gap-3">
                    <img src="/gate-learning-logo.png" alt="Gate Learning" className="w-32" />
                    <span className="text-gray-400">|</span>
                    <span className="font-medium text-gray-800">{projectName}</span>
                </div>
            </div>

            {/* Right: Challenges Button */}
            <div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-gray-200 transition-colors duration-200 font-medium text-sm">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Desafíos
                </button>
            </div>
        </header>
    );
}
