"use client";

import Link from "next/link";
import { FolderOpen, Zap, ArrowRight, Activity } from "lucide-react";

export default function DashboardHome() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Gate Learning</h1>
                <p className="text-gray-500 text-lg">Tu laboratorio digital para experimentar y aprender.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Proyectos Libres Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Proyectos Libres</h2>
                    <p className="text-gray-500 mb-6">
                        Crea circuitos desde cero sin restricciones. Ideal para experimentar libremente.
                    </p>
                    <Link
                        href="/dashboard/projects"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 hover:underline"
                    >
                        Ir a mis proyectos <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                {/* Desafíos Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Desafíos</h2>
                    <p className="text-gray-500 mb-6">
                        Completa misiones estructuradas para aprender conceptos y desbloquear componentes.
                    </p>
                    <Link
                        href="/dashboard/challenges"
                        className="inline-flex items-center text-orange-600 font-medium hover:text-orange-700 hover:underline"
                    >
                        Ver desafíos disponibles <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            {/* Maybe a "Recent Activity" or "Quick Start" section later */}
            <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        Tip del día
                    </h3>
                    <p className="text-slate-300 max-w-lg">
                        ¿Sabías que puedes construir cualquier compuerta lógica utilizando solo compuertas NAND? Intenta construir una compuerta XOR en el modo de Proyectos Libres.
                    </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
            </div>
        </div>
    );
}
