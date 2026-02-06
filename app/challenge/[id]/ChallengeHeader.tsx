"use client";

import { ArrowLeft, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

interface ChallengeHeaderProps {
    title: string;
    description: string;
    onVerify: () => void;
    isVerifying: boolean;
}

export default function ChallengeHeader({ title, description, onVerify, isVerifying }: ChallengeHeaderProps) {
    return (
        <header className="h-22 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative">
            {/* Left: Back button and challenge info */}
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
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Zap className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-800">{title}</h1>
                        <p className="text-xs text-gray-500">{description}</p>
                    </div>
                </div>
            </div>

            {/* Right: Verify Button */}
            <div>
                <button
                    onClick={onVerify}
                    disabled={isVerifying}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                    <CheckCircle className="w-4 h-4" />
                    {isVerifying ? "Verificando..." : "Verificar Solución"}
                </button>
            </div>
        </header>
    );
}
