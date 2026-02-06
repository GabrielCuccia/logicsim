"use client";

import { Lock, CheckCircle } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Challenge } from "../../types";
import { isChallengeCompleted } from "../../lib/progress";

interface ChallengeCardProps {
    challenge: Challenge;
    userLevel: number;
    isFirst?: boolean;
}

export default function ChallengeCard({ challenge, userLevel, isFirst = false }: ChallengeCardProps) {
    const router = useRouter();

    // Dynamic unlock based on user level
    const isUnlocked = userLevel >= challenge.requiredLevel;

    // Fix hydration mismatch: only access local storage on client
    const [isCompleted, setIsCompleted] = React.useState(false);

    React.useEffect(() => {
        setIsCompleted(isChallengeCompleted(challenge.id));
    }, [challenge.id]);

    const handleClick = () => {
        if (isUnlocked) {
            router.push(`/challenge/${challenge.id}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
        relative p-4 rounded-xl border-2 transition-all duration-300
        ${isCompleted
                    ? "border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-md"
                    : isFirst && isUnlocked
                        ? "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md cursor-pointer hover:shadow-lg"
                        : !isUnlocked
                            ? "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer"
                }
      `}
        >
            {/* Status Icon */}
            {isCompleted ? (
                <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
            ) : !isUnlocked && (
                <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-gray-400" />
                </div>
            )}

            {/* Content */}
            <div className="space-y-2">
                <h4 className={`font-semibold ${!isUnlocked ? "text-gray-500" : isCompleted ? "text-green-700" : "text-gray-800"}`}>
                    {challenge.title}
                </h4>
                <p className={`text-sm ${!isUnlocked ? "text-gray-400" : isCompleted ? "text-green-600" : "text-gray-600"}`}>
                    {challenge.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs ${!isUnlocked ? "text-gray-400" : isCompleted ? "text-green-600" : "text-blue-600"}`}>
                        Nivel {challenge.requiredLevel}
                    </span>
                    {isCompleted ? (
                        <span className="text-xs text-green-600 font-medium">
                            ¡Completado!
                        </span>
                    ) : !isUnlocked && (
                        <span className="text-xs text-gray-400">
                            Requiere nivel {challenge.requiredLevel}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
