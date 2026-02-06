"use client";

import { useState, useEffect } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import ProjectCard from "../../components/home/ProjectCard";
import { Project } from "../../types";
import { getProjects, createProject, deleteProject } from "../../lib/storage";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    useEffect(() => {
        setProjects(getProjects());
    }, []);

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            const newProject = createProject(newProjectName.trim(), "Un circuito de prueba");
            setProjects([...projects, newProject]);
            setNewProjectName("");
            setIsCreating(false);
        }
    };

    const handleDeleteProject = (id: string) => {
        deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Proyectos Libres</h1>
                    <p className="text-gray-500">Crea y gestiona tus propios circuitos sin restricciones.</p>
                </div>

                {isCreating ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                            placeholder="Nombre del proyecto..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateProject}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Crear
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Proyecto
                    </button>
                )}
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <LayoutGrid className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No tienes proyectos aún</h3>
                    <p className="text-gray-500 mb-6 max-w-sm text-center">Empieza a experimentar creando tu primer circuito lógico desde cero.</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Crear primer proyecto
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
