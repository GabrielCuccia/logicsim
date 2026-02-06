"use client";

import { useState, useEffect } from "react";
import ChallengeCard from "../../components/home/ChallengeCard";
import { getChallengesByLevel } from "../../data/challenges";
import { getCurrentLevel } from "../../lib/progress";

export default function ChallengesPage() {
    const [userLevel, setUserLevel] = useState(1);

    useEffect(() => {
        setUserLevel(getCurrentLevel());
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Desafíos de Lógica</h1>
                <p className="text-gray-500">Supera niveles para desbloquear nuevos componentes.</p>
            </div>

            {/* Hardware */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Nivel 1</span>
                    <h3 className="text-lg font-bold text-gray-800">Hardware & Fundamentos</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getChallengesByLevel("Hardware").map((challenge, idx) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            userLevel={userLevel}
                            isFirst={idx === 0}
                        />
                    ))}
                </div>
            </div>

            {/* Lógica Básica */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Nivel 2</span>
                    <h3 className="text-lg font-bold text-gray-800">Lógica Básica (NAND World)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getChallengesByLevel("Lógica Básica").map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            userLevel={userLevel}
                        />
                    ))}
                </div>
            </div>

            {/* Lógica Avanzada */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Nivel 3+</span>
                    <h3 className="text-lg font-bold text-gray-800">Lógica Avanzada & Memoria</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getChallengesByLevel("Lógica Avanzada").map((challenge) => (
                        <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            userLevel={userLevel}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
