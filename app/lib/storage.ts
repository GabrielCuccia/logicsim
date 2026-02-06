import { Project } from "../types";
import { Node, Edge } from "@xyflow/react";

const PROJECTS_KEY = "logicsim_projects";

export function getProjects(): Project[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
}

export function getProjectById(id: string): Project | null {
    const projects = getProjects();
    return projects.find((p) => p.id === id) || null;
}

export function saveProject(project: Project): void {
    const projects = getProjects();
    const index = projects.findIndex((p) => p.id === project.id);

    if (index >= 0) {
        projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
        projects.push({ ...project, updatedAt: new Date().toISOString() });
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function createProject(name: string, description: string = ""): Project {
    const newProject: Project = {
        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        updatedAt: new Date().toISOString(),
        nodes: [],
        edges: [],
    };

    saveProject(newProject);
    return newProject;
}

export function deleteProject(id: string): void {
    const projects = getProjects().filter((p) => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function updateProjectData(
    id: string,
    nodes: Node[],
    edges: Edge[]
): void {
    const project = getProjectById(id);
    if (project) {
        saveProject({ ...project, nodes, edges });
    }
}
