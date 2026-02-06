"use client";

import { LayoutGrid, Trash2 } from "lucide-react";
import { Project } from "../../types";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
    project: Project;
    onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleClick = () => {
        router.push(`/simulator/${project.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`¿Eliminar el proyecto "${project.name}"?`)) {
            onDelete(project.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className="group relative bg-gradient-to-br from-blue-50 to-sky-100 border-2 border-blue-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all duration-300"
        >
            {/* Preview Area */}
            <div className="h-28 flex items-center justify-center mb-4 bg-white/50 rounded-lg">
                <LayoutGrid className="w-12 h-12 text-blue-400" />
            </div>

            {/* Project Info */}
            <div className="space-y-1">
                <h3 className="font-semibold text-gray-800 truncate">{project.name}</h3>
                <p className="text-xs text-blue-600">{project.description || "Sin descripción"}</p>
                <p className="text-xs text-gray-500">
                    Actualizado: {formatDate(project.updatedAt)}
                </p>
            </div>

            {/* Delete Button */}
            <button
                onClick={handleDelete}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all duration-200"
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
}
